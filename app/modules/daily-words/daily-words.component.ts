import { Component } from "@angular/core";
import { ScrollEventData } from "ui/scroll-view";


@Component({
    selector: "DailyWords",
    styleUrls: [],
    templateUrl: "./modules/daily-words/daily-words.html"
}) 
export class DailyWordsComponent {
    constructor () {
    }

    public onScroll (data: ScrollEventData) {
        console.log("scrollX: " + data.scrollX);
        console.log("scrollY: " + data.scrollY);
    }
}