import { Injectable } from "@angular/core";

/**
 * Interfaces
 */
import {IAnalyticsLog, CustomErrorType, CustomEventType } from "./logger.interfaces";

/**
 * Services
 */
import { GoogleFirebaseService } from "../google-firebase/google-firebase.service";

@Injectable()
export class LoggerService {
    private postponedLogs: IAnalyticsLog[] = [];
    private isFirebaseStarted = false;

    constructor (private GoogleFirebase: GoogleFirebaseService) {
        const sub = this.GoogleFirebase.started$.subscribe(() => {
            this.isFirebaseStarted = true;
            if (this.postponedLogs.length > 0) {
                for (const log of this.postponedLogs) {
                    this.GoogleFirebase.$Native.analytics.logEvent(log);
                }
            }
            sub.unsubscribe();
        });
    }

    public event (type: CustomEventType, data?: any) {
        console.log(`LOGGER EVENT '${type}':`, data || "");
        this.sendLog({
            key: type,
            parameters: data ? [data] : []
        });
    }

    public error (type: CustomErrorType, error: Error) {
        console.log(`LOGGER ERROR '${type}':`, error.name);
        this.sendLog({
            key: type,
            parameters: [{
                name: error.name,
                message: error.message,
                error: error.toString()
            }]
        });
    }

    private sendLog (log: IAnalyticsLog) {
        if (this.isFirebaseStarted) {
            this.GoogleFirebase.$Native.analytics.logEvent(log).then(() => {
                console.log("=> EVENT LOGGED");
            }).catch(() => {
                console.log("Error while sending log to Firebase");
            });
        }
        else {
            this.postponedLogs.push(log);
        }
    }
}
