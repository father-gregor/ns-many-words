import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

/**
 * Interfaces
 */
import {IAnalyticsLog, CustomErrorType, CustomEventType } from "./logger.interfaces";

/**
 * Services
 */
import { GoogleFirebaseService } from "../google-firebase/google-firebase.service";
import { MainConfigService } from "../main-config/main-config.service";

@Injectable()
export class LoggerService {
    private postponedFirebaseLogs: IAnalyticsLog[] = [];
    private isFirebaseStarted = false;

    constructor (
        private GoogleFirebase: GoogleFirebaseService,
        private http: HttpClient,
        private MainConfig: MainConfigService
    ) {
        const sub = this.GoogleFirebase.started$.subscribe(() => {
            this.isFirebaseStarted = true;
            if (this.postponedFirebaseLogs.length > 0) {
                for (const log of this.postponedFirebaseLogs) {
                    this.GoogleFirebase.$NativeFirebase.analytics.logEvent(log);
                }
            }
            sub.unsubscribe();
        });
    }

    public event (type: CustomEventType, data?: any) {
        this.sendLog({
            key: type,
            parameters: data ? [data] : []
        });
    }

    public error (type: CustomErrorType, error: Error) {
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
            this.GoogleFirebase.$NativeFirebase.analytics.logEvent(log).catch(() => {
                console.log("Error while sending log to Firebase");
            });
        }
        else {
            this.postponedFirebaseLogs.push(log);
        }

        this.http.post(this.MainConfig.config.loggingUrl, log);
    }
}
