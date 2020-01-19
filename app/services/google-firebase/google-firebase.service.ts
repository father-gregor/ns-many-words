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
import { IAdConfig } from "~/config/main.config";

@Injectable()
export class GoogleFirebaseService {
    public readonly $NativeFirebase: typeof Firebase;
    public started$: Subject<void> = new Subject<void>();

    private currentAds: {[key: string]: {isOpened: boolean}} = {};

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

    public async showAdBanner (adId: string, customBannerOptions?: BannerOptions) {
        if (!this.MainConfig.config.isAdsEnabled) {
            return;
        }

        if (this.currentAds[adId]) {
            if (this.currentAds[adId].isOpened) {
                return;
            }
            else {
                this.currentAds[adId].isOpened = true;
            }
        }
        else {
            this.currentAds[adId] = {isOpened: true};
        }

        const adConfig: IAdConfig = (this.MainConfig.config.ads.find((a) => a.id === adId)) || {} as IAdConfig;
        const bannerOptions = Object.assign({}, {
            size: this.$NativeFirebase.admob.AD_SIZE.FULL_BANNER,
            margins: {
                top: 54
            },
            androidBannerId: adConfig.android || "ca-app-pub-3940256099942544/6300978111",
            iosBannerId: adConfig.ios || "ca-app-pub-3940256099942544/6300978111",
            keywords: adConfig.keywords || [],
            testing: TNS_MODE === "development",
            onOpened: () => console.log("ZZZZZZZZZZZZZZZ Ad opened"),
            onClicked: () => console.log("ZZZZZZZZZZZZZZZ Ad clicked"),
            onCloded: () => console.log("ZZZZZZZZZZZZZZZ Ad closed"),
            onLeftApplication: () => console.log("ZZZZZZZZZZZZZZZ Ad left application")
        }, customBannerOptions);

        return this.$NativeFirebase.admob.showBanner(bannerOptions).then(
            () => this.currentAds[adId].isOpened = true,
            () => this.currentAds[adId].isOpened = false
        );
    }

    public hideAdBanner (adId: string) {
        if (!this.MainConfig.config.isAdsEnabled || !this.currentAds[adId] || !this.currentAds[adId].isOpened) {
            return;
        }

        this.currentAds[adId].isOpened = false;
        return this.$NativeFirebase.admob.hideBanner().then(() => {}, () => this.currentAds[adId].isOpened = true);
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
