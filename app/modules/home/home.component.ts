import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { TabView, SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { connectionType } from "tns-core-modules/connectivity/connectivity";
import { Subject } from "rxjs";

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
    public tabView: TabView;
    public noConnectionError = false;

    @ViewChild("mainActionBar") public mainActionBarComponent: MainActionBarComponent;
    @ViewChild("tabView") public tabElement: any;

    private currentPos = 0;
    private changeMargin$ = new Subject<number> ();

    constructor (
        private CurrentTab: CurrentTabService,
        private ConnectionMonitor: ConnectionMonitorService
    ) {
        this.CurrentTab.setCurrentTab(this.wordsTab[0]);

        this.changeMargin$.subscribe((marginTop: number) => {
            this.mainActionBarComponent.actionBarView.style.marginTop = marginTop;
        });

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
        this.tabView = this.tabElement.nativeElement as TabView;
    }

    public onSelectedTabChanged (event: SelectedIndexChangedEventData) {
        this.CurrentTab.setCurrentTab(this.wordsTab[event.newIndex]);
    }

    public onTabScroll (event: ITabScrollEvent) {
        const actionBarHeight = this.mainActionBarComponent.actionBarView.getActualSize().height;
        if (event.direction === "up" && Math.abs(this.currentPos) < actionBarHeight) {
            for (let i = 0; i < event.steps; i++) {
                this.currentPos--;
                if (Math.abs(this.currentPos) > actionBarHeight) {
                    break;
                }
                this.changeMargin$.next(this.currentPos);
            }
        }
        else if (event.direction === "down" && this.currentPos < 0) {
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
