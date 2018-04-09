import { Component } from "@angular/core";
import { IWordTab } from "./tab";

export class DataItem {
    constructor(public itemDesc: string) {}
}

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
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
    public items: Array<DataItem>;

    constructor() {
        this.items = new Array<DataItem>();
        for (let i = 0; i < 5; i++) {
            this.items.push(new DataItem("item " + i));
        }
    }
}