import { Injectable } from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";
import * as Firebase from "nativescript-plugin-firebase";

@Injectable()
export class GoogleFirebaseService {

    constructor (public router: Router) {
        Firebase.init({}).then((instance) => {
            console.log("firebase.init done");
            this.startRouterTracking();
        }, (error) => {
            console.log(`firebase.init error: ${error}`);
        });
    }

    private startRouterTracking () {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                Firebase.analytics.logEvent({
                    key: "pageview",
                    parameters: [{
                        key: "page_id",
                        value: event.urlAfterRedirects
                    }]
                });
            }
        });
    }
}
