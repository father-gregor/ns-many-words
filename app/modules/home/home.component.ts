import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';

import { IWordTab } from "~/modules/home/tab";
import { MainActionBarComponent } from '~/modules/main-action-bar/main-action-bar.component';
import { ScrollDirection } from '~/modules/master-words/master-words.interfaces';
import { Animation, AnimationDefinition } from 'tns-core-modules/ui/animation/animation';
import { TabView } from 'tns-core-modules/ui/tab-view';
import { GestureTypes } from "tns-core-modules/ui/gestures/gestures";
import { View } from 'tns-core-modules/ui/core/view';

@Component({
    selector: "Home",
    moduleId: module.id,
    styleUrls: ["./home-common.css", "./home.css"],
    templateUrl: "./home.html"
})
export class HomeComponent implements AfterViewInit {
    public dailyWordsTab: IWordTab = {
        title: "Daily Words",
        index: 0
    };
    public randomWordsTab: IWordTab = {
        title: "Random Words",
        index: 1
    };
    public memeWordsTab: IWordTab = {
        title: "Meme Words",
        index: 2
    };
    public tabView: TabView;
    public lastVerticalOffset = 0;

    @ViewChild("mainActionBar") public mainActionBarComponent: MainActionBarComponent;
    @ViewChild("tabView") public tabElement: any;

    private currentPos = 0;

    constructor(private page: Page) {
    }

    ngAfterViewInit () {
        // this.page.style.marginTop = -60;
        this.tabView = this.tabElement.nativeElement as TabView;
        console.log('11TESTTETE', this.tabView);
        (this.tabView as View).on(GestureTypes.pan, () => {
            console.log('PANNED')
        });
    }

    public onTabChange () {
        this.lastVerticalOffset = 0;
    }

    public onTabScroll (event: {scrollYDiff: number, direction: ScrollDirection}) {
        this.mainActionBarComponent.animateScroll(event.direction);
        //this.mainActionBarComponent.toggleActionBar(event.scrollYDiff, event.direction);
        /*
        const actionBarAnimation = this.mainActionBarComponent.getScrollAnimation(event.scrollYDiff, event.direction);

        if (actionBarAnimation) {
            const tabViewAnimation: AnimationDefinition = {
                target: this.page,
                translate: {x: 0, y: actionBarAnimation.translate.y},
                duration: actionBarAnimation.duration
            };
            const scrollAnimationSet = new Animation([
                actionBarAnimation,
                tabViewAnimation
            ]);

            scrollAnimationSet.play().catch((e) => {
                console.log(e.message);
            });
        }
        /*
        const actionBarHeight = this.mainActionBarComponent.actionBarView.getActualSize().height;
        if (event.direction === 'down') {
            let pos = this.currentPos + actionBarHeight / 7;
            if (pos <= actionBarHeight) {
                this.currentPos = pos;
                this.page.style.marginTop = -this.currentPos;
            }
        }
        else if (event.direction === 'up') {
            let pos = this.currentPos - actionBarHeight / 7;
            if (pos >= 0) {
                this.currentPos = pos;
                if (pos < (actionBarHeight / 7) * 2) {
                    this.page.style.marginTop = -this.currentPos;
                }
            }
        }*/
    }
}