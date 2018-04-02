import { Component } from "@angular/core";
import { ScrollEventData } from "ui/scroll-view";


@Component({
    selector: "RecentWords",
    styleUrls: [],
    templateUrl: "./modules/recent-words/recent-words.html"
}) 
export class RecentWordsComponent {
    constructor () {
    }

    public onScroll (data: ScrollEventData) {
        console.log("scrollX: " + data.scrollX);
        console.log("scrollY: " + data.scrollY);
    }
}