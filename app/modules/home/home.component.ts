import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { TabView, SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Subject } from "rxjs";

import { IWordTab } from "~/modules/home/tab";
import { MainActionBarComponent } from "~/modules/main-action-bar/main-action-bar.component";
import { ITabScrollEvent } from "~/modules/master-words/master-words.interfaces";
import { CurrentTabService } from "~/services/current-tab/current-tab.service";

@Component({
    selector: "Home",
    moduleId: module.id,
    styleUrls: ["./home-common.css", "./home.css"],
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
    public tabView: TabView;

    @ViewChild("mainActionBar") public mainActionBarComponent: MainActionBarComponent;
    @ViewChild("tabView") public tabElement: any;

    private currentPos = 0;
    private changeMargin$ = new Subject<number> ();

    constructor (private CurrentTab: CurrentTabService) {
        this.CurrentTab.setCurrentTab(this.wordsTab[0]);

        this.changeMargin$.subscribe((marginTop: number) => {
            this.mainActionBarComponent.actionBarView.style.marginTop = marginTop;
        });
    }

    public ngAfterViewInit () {
        this.tabView = this.tabElement.nativeElement as TabView;
    }

    public onSelectedTabChanged (event: SelectedIndexChangedEventData) {
        this.CurrentTab.setCurrentTab(this.wordsTab[event.newIndex]);
    }

    public onTabScroll (event: ITabScrollEvent) {
        const actionBarHeight = this.mainActionBarComponent.actionBarView.getActualSize().height;
        if (event.direction === "up" && Math.abs(this.currentPos) < actionBarHeight) {
            // Pretty good configuration for scroll. Maybe need to make steps bigger if there is a little of margin left to increment
            const steps = 5;
            for (let i = 0; i < event.steps; i++) {
                this.currentPos--;
                if (Math.abs(this.currentPos) > actionBarHeight) {
                    break;
                }
                this.changeMargin$.next(this.currentPos);
            }
        }
        else if (event.direction === "down" && this.currentPos < 0) {
            const steps = 5;
            for (let i = 0; i < event.steps; i++) {
                this.currentPos++;
                if (this.currentPos > 0) {
                    break;
                }
                this.changeMargin$.next(this.currentPos);
            }
        }
    }
}
