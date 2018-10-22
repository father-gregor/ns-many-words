import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { TabView } from 'tns-core-modules/ui/tab-view';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators'

import { IWordTab } from "~/modules/home/tab";
import { MainActionBarComponent } from '~/modules/main-action-bar/main-action-bar.component';
import { ScrollDirection } from '~/modules/master-words/master-words.interfaces';

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
    private changeMargin$ = new Subject<number> ();

    constructor() {
        this.changeMargin$.subscribe((marginTop: number) => {
            this.mainActionBarComponent.actionBarView.style.marginTop = marginTop;
        });
    }

    ngAfterViewInit () {
        this.tabView = this.tabElement.nativeElement as TabView;
    }

    public onTabChange () {
        this.lastVerticalOffset = 0;
    }

    public onTabScroll (event: {direction: ScrollDirection}) {
        let actionBarHeight = this.mainActionBarComponent.actionBarView.getActualSize().height;
        if (event.direction === "up" && Math.abs(this.currentPos) < actionBarHeight) {
            // Pretty good configuration for scroll. Maybe need to make steps bigger if there is a little of margin left to increment
            let steps = 5;
            for (let i = 0; i < steps; i++) {
                this.currentPos--;
                this.changeMargin$.next(this.currentPos);
            }
        }
        else if (event.direction === "down" && this.currentPos < 0) {
            let steps = 5;
            for (let i = 0; i < steps; i++) {
                this.currentPos++;
                this.changeMargin$.next(this.currentPos);
            }
        }
    }
}