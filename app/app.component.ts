import { Component, OnInit } from '@angular/core';
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
        const ids = await LocalNotifications.getScheduledIds();
        if (ids.indexOf(this.newWordNotification.options.id) < 0) {
            let notificationDate = new Date();
            notificationDate.setHours(this.newWordNotification.scheduledTime.hours);
            notificationDate.setMinutes(this.newWordNotification.scheduledTime.minutes);
            notificationDate.setSeconds(this.newWordNotification.scheduledTime.seconds);
            notificationDate.setMilliseconds(this.newWordNotification.scheduledTime.milliseconds);
            LocalNotifications.schedule([{
                ...this.newWordNotification.options,
                at: notificationDate,
                interval: "day",
                sound: "default"
            }]);
        }
    }
}
