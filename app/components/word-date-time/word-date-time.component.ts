import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "WordDateTime",
    styleUrls: ["./word-date-time.scss"],
    templateUrl: "./word-date-time.html"
})
export class WordDateTimeComponent implements OnInit {
    public dynamicStyleClass = "";
    @Input() public dateText: string;
    @Input() public isToday: boolean;

    constructor () {}

    public ngOnInit () {
        if (this.isToday) {
            this.dynamicStyleClass = "today_date";
        }
    }
}
