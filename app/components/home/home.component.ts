import { Component, ViewChild, ChangeDetectorRef, ElementRef, AfterViewInit } from "@angular/core";
import { TabView } from "tns-core-modules/ui/tab-view";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/bottom-navigation";
import { TabStrip } from "tns-core-modules/ui/tab-navigation-base/tab-strip/tab-strip";
import { isAndroid } from "tns-core-modules/platform";

/**
 * Interfaces
 */
import { IWordTab } from "../home/tab";
import { ITabScrollEvent } from "../master-words/master-words.interfaces";

/**
 * Components
 */
import { MainActionBarComponent } from "../action-bars/main-action-bar/main-action-bar.component";

/**
 * Services
 */
import { CurrentTabService } from "../../services/current-tab/current-tab.service";
import { MainConfigService } from "../../services/main-config/main-config.service";

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

    @ViewChild("mainActionBar", { static: false }) public mainActionBarComponent: MainActionBarComponent;
    @ViewChild("wordsTabView", { static: false }) public tabBarElement: ElementRef;
    @ViewChild("tabStripView", { static: false }) public tabStripElement: ElementRef;

    private tabView: TabView;
    private tabStripView: TabStrip;

    private tabViewHeaderHeight;
    private tabViewHeaderHideAnimation: android.animation.ValueAnimator;
    private tabViewHeaderShowAnimation: android.animation.ValueAnimator;
    private isTabViewHeaderAnimInProgress = false;
    private isTabViewHeaderHidden = false;

    constructor (
        public MainConfig: MainConfigService,
        private CurrentTab: CurrentTabService,
        private cd: ChangeDetectorRef
    ) {
        this.CurrentTab.setCurrent(this.wordsTab[0], 0);
        this.cd.detach();
    }

    public ngAfterViewInit () {
        this.cd.detectChanges();
    }

    public onTabsLoaded () {
        this.tabStripView = this.tabStripElement.nativeElement as TabStrip;
    }

    public onTabViewLoaded () {
        const firstLoad = this.tabView == null;
        this.tabView = this.tabBarElement.nativeElement as TabView;
        if (isAndroid && firstLoad) {
            const androidTab = this.tabView.android.tabLayout;
            const layoutParams = androidTab.getLayoutParams();
            layoutParams.height = 150;
            androidTab.setLayoutParams(layoutParams);
        }
    }

    public onSelectedTabChanged (event: SelectedIndexChangedEventData) {
        const currentTabId = this.MainConfig.config.columnsOrder[event.newIndex];
        this.CurrentTab.setCurrent(this.wordsTab[currentTabId], event.newIndex);
        this.cd.detectChanges();
    }

    public onTabScroll (event: ITabScrollEvent) {
        /* if (isAndroid) {
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
        }*/
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
