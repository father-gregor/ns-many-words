import { Component, ViewChild } from "@angular/core";
import { Page } from 'tns-core-modules/ui/page/page';

import { IWordTab } from "~/modules/home/tab";
import { MainActionBarComponent } from '~/modules/main-action-bar/main-action-bar.component';
import { ScrollDirection } from '~/modules/master-words/master-words.interfaces';

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
    public lastVerticalOffset = 0;

    @ViewChild("mainActionBar") public mainActionBarComponent: MainActionBarComponent;

    constructor(private page: Page) {
    }

    public onTabChange () {
        this.lastVerticalOffset = 0;
    }

    public onTabScroll (event: {scrollYDiff: number, direction: ScrollDirection}) {
        this.mainActionBarComponent.toggleActionBar(event.scrollYDiff, event.direction);
    }
}