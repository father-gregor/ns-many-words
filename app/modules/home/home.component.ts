import { Component, OnInit } from "@angular/core";
import { SegmentedBar, SegmentedBarItem } from "ui/segmented-bar"
import { IWordTab } from "./tab";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent {
    public wordTabs: SegmentedBarItem[]; 
    public selectedIndex: number = 0;
    public recentWordsTab: IWordTab;
    public randomWordsTab: IWordTab;

    constructor() {
        this.recentWordsTab = {
            tabItem: this.constructSegmentedBarItem("Recent Words"),
            index: 0,
            visible: true
        };
        this.randomWordsTab = {
            tabItem: this.constructSegmentedBarItem("Random Words"),
            index: 1,
            visible: false
        };

        this.wordTabs = [
            this.recentWordsTab.tabItem,
            this.randomWordsTab.tabItem
        ];
    }

    public onSelectedIndexChange(args) {
        let segmetedBar = <SegmentedBar>args.object;
        this.selectedIndex = segmetedBar.selectedIndex;
        this.setVisibleTab(this.selectedIndex);
    }

    public getVisibility (tab: IWordTab) {
        return tab.visible ? 'visible' : 'collapsed';
    }

    private setVisibleTab (selectedInd: number) {
        for (let tab of ([this.recentWordsTab, this.randomWordsTab] as IWordTab[])) {
            if (tab.index === selectedInd) {
                tab.visible = true;
            }
            else {
                tab.visible = false;
            }
        }
    }

    private constructSegmentedBarItem (title: string) {
        let item = <SegmentedBarItem>new SegmentedBarItem();
        item.title = title;
        return item;
    }
}
