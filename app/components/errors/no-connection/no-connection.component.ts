import { Component, Input, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from "@angular/core";
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
import { UtilsService } from "../../../services/utils/utils.service";

@Component({
    selector: "NoConnection",
    moduleId: module.id,
    styleUrls: ["./no-connection-common.scss"],
    templateUrl: "./no-connection.html"
})
export class NoConnectionComponent implements ITabError, AfterViewInit {
    public isNoConnection = false;
    public isFirstInit = true;
    @Input() public errorMessage = "Device is online!";

    @ViewChild("noConnectionView", {static: false}) public noConnectionView: ElementRef;

    private view: View;

    constructor (
        private ConnectionMonitor: ConnectionMonitorService,
        private cd: ChangeDetectorRef
    ) {}

    public ngAfterViewInit () {
        this.view = this.noConnectionView.nativeElement;
        this.ConnectionMonitor.changes$.subscribe((connection: connectionType) => {
            if ((this.isFirstInit || !this.isNoConnection) && connection === connectionType.none) {
                this.isNoConnection = true;
                this.errorMessage = "Device is offline!";
                this.startSlideAnimation();

                if (this.isFirstInit) {
                    this.isFirstInit = false;
                }
            }
            else if (this.isNoConnection && connection !== connectionType.none) {
                this.isNoConnection = false;
                this.errorMessage = "Device is online!";
                this.startSlideAnimation();
            }
        });
    }

    private startSlideAnimation () {
        const animationOptions: any = {
            duration: 500,
            curve: AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1)
        };

        if (this.isNoConnection) {
            animationOptions.translate = {x: 0, y: 0};
            animationOptions.delay = this.isFirstInit ? 200 : 2000;
        }
        else {
            animationOptions.translate = {x: 0, y: -100};
            animationOptions.delay = 2000;
        }

        setTimeout(() => {
            UtilsService.safeDetectChanges(this.cd);
            this.view.animate(animationOptions);
        }, 100);
    }
}
