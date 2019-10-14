import { Component, Input, ElementRef } from "@angular/core";
import { View } from "tns-core-modules/ui/core/view";
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { connectionType } from "tns-core-modules/connectivity/connectivity";

/**
 * Interfaces
 */
import ITabError from "../errors.interfaces";

/**
 * Services
 */
import { ConnectionMonitorService } from "../../../services/connection-monitor/connection-monitor.service";

@Component({
    selector: "NoConnection",
    moduleId: module.id,
    styleUrls: ["./no-connection-common.scss"],
    templateUrl: "./no-connection.html"
})
export class NoConnectionComponent implements ITabError {
    public isNoConnection = false;
    @Input() public errorMessage = "Device is offline!";

    private animationInProgress = false;
    private view: View;

    constructor (
        private ConnectionMonitor: ConnectionMonitorService,
        el: ElementRef
    ) {
        this.view = el.nativeElement as View;

        this.ConnectionMonitor.changes$.subscribe((connection: connectionType) => {
            if (!this.isNoConnection && connection === connectionType.none) {
                this.isNoConnection = true;
                this.errorMessage = "Device is offline!";
                this.startSlideAnimation();
            }
            else if (this.isNoConnection && connection !== connectionType.none) {
                this.isNoConnection = false;
                this.errorMessage = "Device is online!";
                this.startSlideAnimation();
            }
        });
    }

    private startSlideAnimation () {
        if (this.animationInProgress) {
            return;
        }
        const animationOptions: any = {
            translate: {x: 0, y: 0},
            duration: 300,
            curve: AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1)
        };

        if (this.isNoConnection) {
            animationOptions.translate = {x: 0, y: 0};
        }
        else {
            animationOptions.translate = {x: 0, y: -50};
            animationOptions.delay = 2000;
        }

        this.animationInProgress = true;
        this.view.animate(animationOptions).then(() => {
            this.animationInProgress = false;
        });
    }
}
