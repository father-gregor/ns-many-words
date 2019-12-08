import { Component, ViewChild, ChangeDetectorRef, ElementRef, AfterViewInit } from "@angular/core";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/bottom-navigation";

/**
 * Interfaces
 */
import { IWordTab } from "../home/tab";

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
    public wordsTab: {[key: string]: IWordTab} = {
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
    public isFirstLoadingComplete: {[key: string]: boolean} = {};
    public currentTabId: string;

    @ViewChild("mainActionBar", { static: false }) public mainActionBarComponent: MainActionBarComponent;
    @ViewChild("wordsTabView", { static: false }) public tabBarElement: ElementRef;

    constructor (
        public MainConfig: MainConfigService,
        private CurrentTab: CurrentTabService,
        private cd: ChangeDetectorRef
    ) {
        this.CurrentTab.setCurrent(this.wordsTab[0], 0);
        for (const column of this.MainConfig.config.columnsOrder) {
            this.isFirstLoadingComplete[column] = false;
        }
        this.cd.detach();
    }

    public ngAfterViewInit () {
        this.cd.detectChanges();
    }

    public onSelectedTabChanged (event: SelectedIndexChangedEventData) {
        this.currentTabId = this.MainConfig.config.columnsOrder[event.newIndex];
        if (!this.isFirstLoadingComplete[this.currentTabId]) {
            this.isFirstLoadingComplete[this.currentTabId] = true;
        }
        this.CurrentTab.setCurrent(this.wordsTab[this.currentTabId], event.newIndex);
        this.cd.detectChanges();
    }
}
