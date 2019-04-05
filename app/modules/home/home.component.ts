import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { connectionType } from "tns-core-modules/connectivity/connectivity";
import { isAndroid } from "tns-core-modules/platform";

/**
 * Interfaces
 */
import { IWordTab } from "~/modules/home/tab";
import { ITabScrollEvent } from "~/modules/master-words/master-words.interfaces";

/**
 * Components
 */
import { MainActionBarComponent } from "~/modules/main-action-bar/main-action-bar.component";

/**
 * Services
 */
import { CurrentTabService } from "~/services/current-tab/current-tab.service";
import { ConnectionMonitorService } from "~/services/connection-monitor/connection-monitor.service";

@Component({
    selector: "Home",
    moduleId: module.id,
    styleUrls: ["./home-common.scss", "./home.scss"],
    templateUrl: "./home.html"
})
export class HomeComponent implements AfterViewInit {
    public wordsTab: IWordTab[] = [
        {
            title: "Daily Words",
            id: "daily"
        },
        {
            title: "Random Words",
            id: "random"
        },
        {
            title: "Meme Words",
            id: "meme"
        }
    ];
    public noConnectionError = false;

    @ViewChild("mainActionBar") public mainActionBarComponent: MainActionBarComponent;

    private actionBarHeight = 0;
    private actionBarHideAnimation: android.animation.ValueAnimator;
    private actionBarShowAnimation: android.animation.ValueAnimator;
    private isActionBarHidden = false;

    constructor (
        private CurrentTab: CurrentTabService,
        private ConnectionMonitor: ConnectionMonitorService
    ) {
        this.CurrentTab.setCurrentTab(this.wordsTab[0]);

        this.ConnectionMonitor.changes$.subscribe((connection: connectionType) => {
            if (!this.noConnectionError && connection === connectionType.none) {
                this.noConnectionError = true;
            }
            else if (this.noConnectionError && connection !== connectionType.none) {
                this.noConnectionError = false;
            }
        });
    }

    public ngAfterViewInit () {
        if (isAndroid) {
            const timerId = setInterval(() => {
                if (this.mainActionBarComponent.actionBarView.nativeView) {
                    clearInterval(timerId);
                    this.actionBarHeight = this.mainActionBarComponent.actionBarView.nativeView.getMeasuredHeight();
                    this.actionBarHideAnimation = this.getActionBarHeightAnimation([this.actionBarHeight, 0]);
                    this.actionBarShowAnimation = this.getActionBarHeightAnimation([0, this.actionBarHeight]);
                }
            }, 50);
        }
    }

    public onSelectedTabChanged (event: SelectedIndexChangedEventData) {
        this.CurrentTab.setCurrentTab(this.wordsTab[event.newIndex]);
    }

    public onTabScroll (event: ITabScrollEvent) {
        if (event.direction === "up" && !this.isActionBarHidden) {
            this.isActionBarHidden = true;
            this.actionBarHideAnimation.start();
        }
        else if (event.direction === "down" && this.isActionBarHidden) {
            this.isActionBarHidden = false;
            this.actionBarShowAnimation.start();
        }
    }

    private getActionBarHeightAnimation (heightValues: number[]) {
        const anim = android.animation.ValueAnimator.ofInt(heightValues);
        anim.addUpdateListener(new android.animation.ValueAnimator.AnimatorUpdateListener({
            onAnimationUpdate: (valueAnimator: android.animation.ValueAnimator) => {
                const val = valueAnimator.getAnimatedValue();
                const layoutParams = this.mainActionBarComponent.actionBarView.nativeView.getLayoutParams();
                layoutParams.height = val;
                this.mainActionBarComponent.actionBarView.nativeView.setLayoutParams(layoutParams);
            }
        }));
        anim.setDuration(300);

        return anim;
    }
}
