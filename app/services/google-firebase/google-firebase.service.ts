import { Injectable } from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";
import { Subject } from "rxjs";
import { crashlytics } from "nativescript-plugin-firebase";
import * as Firebase from "nativescript-plugin-firebase";

import { MainConfigService } from "../main-config/main-config.service";

@Injectable()
export class GoogleFirebaseService {
    public readonly $NativeFirebase;
    public started$: Subject<void> = new Subject<void>();

    constructor (private router: Router, private MainConfig: MainConfigService) {
        this.$NativeFirebase = Firebase;
    }

    public init () {
        this.$NativeFirebase.init({
            showNotificationsWhenInForeground: true,
            crashlyticsCollectionEnabled: true
        }).then(async () => {
            this.listenForPushNotifications();
            this.startRouterTracking();
            await this.subscribeToPushNotifications();

            this.started$.next();
        }, (error) => {
            console.log(`firebase.init error: ${error}`);
        });
    }

    public sendCrashLog (err: any) {
        console.log("SendLog");
        crashlytics.sendCrashLog(err);
    }

    private listenForPushNotifications () {
        this.$NativeFirebase.addOnMessageReceivedCallback((message) => {
            console.log(`Title: ${message.title}`);
            console.log(`Body: ${message.body}`);
            // if your server passed a custom property called 'foo', then do this:
            console.log(`Value of 'foo': ${message.data.foo}`);
        });
    }

    private startRouterTracking () {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.$NativeFirebase.analytics.logEvent({
                    key: "page_view",
                    parameters: [{
                        key: "page_url",
                        value: event.urlAfterRedirects
                    }]
                });
            }
        });
    }

    private async subscribeToPushNotifications () {
        for (const topic of this.MainConfig.config.pushNotificationTopics) {
            await this.$NativeFirebase.subscribeToTopic(topic);
        }
    }
}
