import { Component, ViewChild } from "@angular/core";
import { ScrollEventData } from 'tns-core-modules/ui/scroll-view/scroll-view';

import { IWordTab } from "./tab";
import { View } from 'tns-core-modules/ui/page/page';

@Component({
    selector: "Home",
    moduleId: module.id,
    styleUrls: ["./home-common.css", "./home.css"],
    templateUrl: "./home.html"
})
export class HomeComponent {
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

    @ViewChild('actionBar') public actionBarView: View;

    constructor() {}

    public onScroll (event: ScrollEventData) {
        console.log("ActionBar", this.actionBarView);
    }
}