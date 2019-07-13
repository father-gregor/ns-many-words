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
            title: "Daily",
            icon: "res://tab_icon_daily",
            id: "daily"
        },
        random: {
            title: "Random",
            icon: "res://tab_icon_random",
            id: "random"
        },
        meme: {
            title: "Meme",
            icon: "res://tab_icon_meme",
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
        this.CurrentTab.setCurrent(this.wordsTab[0], 0);

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
        const firstLoad = this.tabView == null;
        this.tabView = this.tabBarElement.nativeElement as TabView;
        if (isAndroid && firstLoad) {
            const androidTab = this.tabView.android.tabLayout;
            const layoutParams = androidTab.getLayoutParams();
            layoutParams.height = 150;
            androidTab.setLayoutParams(layoutParams);

            let selectedTabIndex = this.CurrentTab.getCurrentIndex();
            if (selectedTabIndex == null) {
                selectedTabIndex = 0;
            }
            this.setTabIconColor(selectedTabIndex, "selected");
            for (let i = 0; i < Object.keys(this.wordsTab).length; i++) {
                if (i !== selectedTabIndex) {
                    this.setTabIconColor(i, "unselected");
                }
            }
        }
    }

    public onSelectedTabChanged (event: SelectedIndexChangedEventData) {
        this.CurrentTab.setCurrent(this.wordsTab[event.newIndex], event.newIndex);
        this.setTabIconColor(event.oldIndex, "unselected");
        this.setTabIconColor(event.newIndex, "selected");
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

    private setTabIconColor (tabIndex: number, type: "selected" | "unselected") {
        if (!this.tabView) {
            return;
        }
        const androidTab = this.tabView.android.tabLayout;
        const tabIconColor = type === "unselected" ? android.graphics.Color.GRAY : android.graphics.Color.WHITE;
        /**
         * Note: This version of setColorFilter method was deprecated in API level 29
         * Why so many getChildAt? Actual layout has structure that looks like that:
         * TabLayout (androidTab variable here) => TabStrip => LinearLayout => ImageView
         */
        androidTab.getChildAt(0)
            .getChildAt(tabIndex)
            .getChildAt(0)
            .getDrawable()
            .setColorFilter(tabIconColor, android.graphics.PorterDuff.Mode.MULTIPLY);
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
