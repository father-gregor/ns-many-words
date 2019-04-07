import { Injectable, NgZone } from "@angular/core";
import { Subject } from "rxjs";
import { start, removeCallback, addCallback, stop } from "tns-core-modules/fps-meter";

/**
 * Interfaces
 */
import { IFpsLog } from "./fps-logger.interfaces";

@Injectable()
export class FpsLoggerService {
    public newLog$: Subject<IFpsLog> = new Subject<IFpsLog> ();

    private fps: string;
    private minFps: string;
    private callbackId: number;

    constructor (private zone: NgZone) {}

    public start () {
        if (this.callbackId) {
            this.stop();
        }
        this.callbackId = addCallback((fps: number, minFps: number) => {
            this.zone.run(() => {
                this.fps = fps.toFixed(2);
                this.minFps = minFps.toFixed(2);
                this.newLog$.next({
                    fps: this.fps,
                    minFps: this.minFps
                });
            });
        });

        start();
    }

    public stop () {
        removeCallback(this.callbackId);
        stop();
        this.callbackId = null;
    }
}
