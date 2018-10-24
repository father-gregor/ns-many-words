import { Component, OnInit } from '@angular/core';
import * as Firebase from "nativescript-plugin-firebase";
import { LocalNotifications } from "nativescript-local-notifications";

import * as mainConfig from "./config/main.config.json";

@Component({
    selector: "many-words-app",
    moduleId: module.id,
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    private newWordNotification = (mainConfig as any).newWordNotification;

    constructor() {}

    async ngOnInit () {
        Firebase.init({
            // Optionally pass in properties for database, authentication and cloud messaging,
            // see their respective docs.
        }).then((instance) => {
            console.log("firebase.init done");
        }, (error) => {
            console.log(`firebase.init error: ${error}`);
        });

        await LocalNotifications.cancelAll();
    }
}
