import { Injectable } from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";
import { Subject } from "rxjs";
import * as Firebase from "nativescript-plugin-firebase";

import { MainConfigService } from "../main-config/main-config.service";

@Injectable()
export class GoogleFirebaseService {
    public readonly $Native;
    public started$: Subject<void> = new Subject<void>();

    constructor (private router: Router, private MainConfig: MainConfigService) {
        this.$Native = Firebase;
    }

    public init () {
        this.$Native.init({
            showNotificationsWhenInForeground: true
        }).then(async () => {
            this.listenForPushNotifications();
            this.startRouterTracking();
            await this.subscribeToPushNotifications();

            this.started$.next();
        }, (error) => {
            console.log(`firebase.init error: ${error}`);
        });
    }

    private listenForPushNotifications () {
        this.$Native.addOnMessageReceivedCallback((message) => {
            console.log(`Title: ${message.title}`);
            console.log(`Body: ${message.body}`);
            // if your server passed a custom property called 'foo', then do this:
            console.log(`Value of 'foo': ${message.data.foo}`);
        });
    }

    private startRouterTracking () {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.$Native.analytics.logEvent({
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
            await this.$Native.subscribeToTopic(topic);
        }
    }
}
