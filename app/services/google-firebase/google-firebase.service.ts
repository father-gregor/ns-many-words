import { Injectable } from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";
import { Subject } from "rxjs";
import { crashlytics } from "nativescript-plugin-firebase";
import * as Firebase from "nativescript-plugin-firebase";
import { BannerOptions } from "nativescript-plugin-firebase/admob/admob";

/**
 * Services
 */
import { MainConfigService } from "../main-config/main-config.service";

@Injectable()
export class GoogleFirebaseService {
    public readonly $NativeFirebase: typeof Firebase;
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

    public async showAdBanner (customBannerOptions?: BannerOptions) {
        const bannerOptions = Object.assign({}, {
            size: this.$NativeFirebase.admob.AD_SIZE.FULL_BANNER, // see firebase.admob.AD_SIZE for all options
            margins: { // optional nr of device independent pixels from the top or bottom (don't set both)
              top: 54
            },
            androidBannerId: "ca-app-pub-3940256099942544/6300978111",
            iosBannerId: "ca-app-pub-3940256099942544/6300978111",
            testing: true,
            iosTestDeviceIds: [ /*Android automatically adds the connected device as test device with testing:true, iOS does not*/],
            keywords: ["keyword1", "keyword2"], // add keywords for ad targeting
            onOpened: () => console.log("Ad opened"),
            onClicked: () => console.log("Ad clicked"),
            onLeftApplication: () => console.log("Ad left application")
        }, customBannerOptions);

        return this.$NativeFirebase.admob.showBanner(bannerOptions).then(
              () => {
                  console.log("AdMob banner showing");
              },
              (errorMessage) => {
                  console.log("AdMob banner error", errorMessage);
              }
        );
    }

    public hideAdBanner () {
        return this.$NativeFirebase.admob.hideBanner().then(
            () => {},
            (errorMessage) => {
                console.log("AdMob banner error", errorMessage);
            }
        );
    }

    public sendCrashLog (err: any) {
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
