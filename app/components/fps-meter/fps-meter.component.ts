import { Component, ChangeDetectorRef } from "@angular/core";

/**
 * Interfaces
 */
import { IFpsLog } from "../../services/fps-logger/fps-logger.interfaces";

/**
 * Services
 */
import { FpsLoggerService } from "../../services/fps-logger/fps-logger.service";

@Component({
    selector: "FpsMeter",
    moduleId: module.id,
    styleUrls: ["./fps-meter-common.scss"],
    templateUrl: "./fps-meter.html"
})
export class FpsMeterComponent {
    public currentFps: string;

    constructor (
        private FpsLogger: FpsLoggerService,
        private cd: ChangeDetectorRef
    ) {
        this.FpsLogger.newLog$.subscribe((newLog: IFpsLog) => {
            this.currentFps = newLog.fps;
            this.cd.detectChanges();
        });
        this.FpsLogger.start();
    }
}
