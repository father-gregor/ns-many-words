import { Component, ViewChild, ChangeDetectorRef, ElementRef, AfterViewInit } from "@angular/core";
import { SelectedIndexChangedEventData, TabView } from "tns-core-modules/ui/tab-view";
import { connectionType } from "tns-core-modules/connectivity/connectivity";
import { isAndroid } from "tns-core-modules/platform";

/**
 * Interfaces
 */
import { IWordTab } from "~/components/home/tab";
import { ITabScrollEvent } from "~/components/master-words/master-words.interfaces";

/**
 * Components
 */
import { MainActionBarComponent } from "~/components/action-bars/main-action-bar/main-action-bar.component";

/**
 * Services
 */
import { CurrentTabService } from "~/services/current-tab/current-tab.service";
import { ConnectionMonitorService } from "~/services/connection-monitor/connection-monitor.service";
import { MainConfigService } from "~/services/main-config/main-config.service";

@Component({
    selector: "Home",
    moduleId: module.id,
    styleUrls: ["./home-common.scss", "./home.scss"],
    templateUrl: "./home.html"
})
export class HomeComponent implements AfterViewInit {
    public wordsTab: { [key: string]: IWordTab } = {
        daily: {
            title: "Daily Words",
            id: "daily"
        },
        random: {
            title: "Random Words",
            id: "random"
        },
        meme: {
            title: "Meme Words",
            id: "meme"
        }
    };
    public noConnectionError = false;

    @ViewChild("mainActionBar", { static: false }) public mainActionBarComponent: MainActionBarComponent;
    @ViewChild("wordsTabView", { static: false }) public tabBarElement: ElementRef;

    private tabView: TabView;

    private tabViewHeaderHeight;
    private tabViewHeaderHideAnimation: android.animation.ValueAnimator;
    private tabViewHeaderShowAnimation: android.animation.ValueAnimator;
    private isTabViewHeaderAnimInProgress = false;
    private isTabViewHeaderHidden = false;

    constructor (
        public MainConfig: MainConfigService,
        private CurrentTab: CurrentTabService,
        private ConnectionMonitor: ConnectionMonitorService,
        private cd: ChangeDetectorRef
    ) {
        this.CurrentTab.setCurrent(this.wordsTab[0]);

        this.ConnectionMonitor.changes$.subscribe((connection: connectionType) => {
            if (!this.noConnectionError && connection === connectionType.none) {
                this.noConnectionError = true;
            }
            else if (this.noConnectionError && connection !== connectionType.none) {
                this.noConnectionError = false;
            }
        });
        this.cd.detach();
    }

    public ngAfterViewInit () {
        this.cd.detectChanges();
    }

    public onTabViewLoaded () {
        this.tabView = this.tabBarElement.nativeElement as TabView; 
    }

    public onSelectedTabChanged (event: SelectedIndexChangedEventData) {
        this.CurrentTab.setCurrent(this.wordsTab[event.newIndex]);
        this.cd.detectChanges();
    }

    public onTabScroll (event: ITabScrollEvent) {
        if (isAndroid) {
            if (this.isTabViewHeaderAnimInProgress) {
                return;
            }

            if (this.tabViewHeaderHeight == null) {
                this.tabViewHeaderHeight = this.tabView.android.tabLayout.getHeight();
                this.tabViewHeaderHideAnimation = this.getTabViewHeaderHeightAnimation([this.tabViewHeaderHeight, 0]);
                this.tabViewHeaderShowAnimation = this.getTabViewHeaderHeightAnimation([0, this.tabViewHeaderHeight]);
            }

            if (event.direction === "up" && !this.isTabViewHeaderHidden) {
                this.isTabViewHeaderAnimInProgress = true;
                this.isTabViewHeaderHidden = true;
                this.tabViewHeaderHideAnimation.start();
                this.cd.detectChanges();
            }
            else if (event.direction === "down" && this.isTabViewHeaderHidden) {
                this.isTabViewHeaderAnimInProgress = true;
                this.isTabViewHeaderHidden = false;
                this.tabViewHeaderShowAnimation.start();
                this.cd.detectChanges();
            }
        }
    }

    private getTabViewHeaderHeightAnimation (heightValues: number[]) {
        const anim = android.animation.ValueAnimator.ofInt(heightValues);
        anim.addUpdateListener(new android.animation.ValueAnimator.AnimatorUpdateListener({
            onAnimationUpdate: (valueAnimator: android.animation.ValueAnimator) => {
                const val = valueAnimator.getAnimatedValue();
                const layoutParams = this.tabView.android.tabLayout.getLayoutParams();
                layoutParams.height = val;
                this.tabView.android.tabLayout.setLayoutParams(layoutParams);
            }
        }));
        anim.addListener(new android.animation.Animator.AnimatorListener({
            onAnimationEnd: (param: android.animation.Animator) => {
                this.isTabViewHeaderAnimInProgress = false;
            },
            onAnimationStart: () => {},
            onAnimationCancel: () => {},
            onAnimationRepeat: () => {}
        }));
        anim.setDuration(300);

        return anim;
    }
}
