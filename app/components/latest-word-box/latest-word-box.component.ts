import { Component, ViewChild, ElementRef, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "LatestWordBox",
    moduleId: module.id,
    styleUrls: [
        "../word-box/word-box-common.scss",
        "../word-box/word-box.scss",
        "./latest-word-box-common.scss"
    ],
    templateUrl: "./latest-word-box.html"
})
export class LatestWordBox {
    public animationState: "openNewWord" | never;
    public isOpening = false;
    public cardRippleColor = "gold";
    @Output("onLatestWordOpen") public onLatestWordOpenEmitter: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild("wordBox", {static: false}) public element: ElementRef;

    constructor () {}

    public openLatestWord () {
        if (this.isOpening) {
            return;
        }
        this.isOpening = true;
        this.onLatestWordOpenEmitter.emit();
    }
}
