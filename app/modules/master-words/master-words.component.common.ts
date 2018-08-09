import { EventEmitter, Output, OnInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ScrollEventData, ScrollView } from "tns-core-modules/ui/scroll-view/scroll-view";
import { GestureTypes, PanGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { View } from "tns-core-modules/ui/core/view";

import * as dateformat from "dateformat";

import { IWord, IWordQueryOptions } from "~/modules/word-box/word-box.definitions";
import { ScrollDirection } from "~/modules/master-words/master-words.interfaces";

// const dateformat = require("dateformat");
@Component({
    selector: "MasterWords",
    template: "<section></section>"
})
export class MasterWordsComponentCommon implements OnInit {
    protected scrollView: ScrollView;
    public noWordsMsg: string;
    public showNoWordsMsg: boolean = false;
    public isLoading: boolean = false;

    @Output("onTabScroll") public onTabScrollEmitter: EventEmitter<{scrollYDiff?: number, direction: ScrollDirection}> = new EventEmitter<{scrollYDiff: number, direction: ScrollDirection}>();
    @ViewChild("wordsContainer") public wordsContainer: ElementRef;

    protected initialDeltaY = 0;
    protected lastDeltaY = 0; 
    protected lastPanDirection: ScrollDirection;

    constructor() {}

    ngOnInit () {
        const panDelay = 10;
        this.scrollView = this.wordsContainer.nativeElement as ScrollView;
        (this.scrollView as View).on(GestureTypes.pan, (event: PanGestureEventData) => {
            let deltaY = Math.round(event.deltaY);
            if (deltaY - this.lastDeltaY < -panDelay || deltaY - this.lastDeltaY > panDelay) {
                this.initialDeltaY = 0;
                this.lastDeltaY = deltaY;
                this.lastPanDirection = null;
            }

            // If in the continious pan we start moving in the opposite direction
            if (this.lastPanDirection === "up" && deltaY > this.lastDeltaY || this.lastPanDirection === "down" && deltaY < this.lastDeltaY) {
                this.initialDeltaY = deltaY;
                this.lastPanDirection = null;
            }

            if ((deltaY - this.initialDeltaY) < -panDelay) {
                this.lastPanDirection = "up";
                this.onTabScrollEmitter.emit({direction: this.lastPanDirection});
            }
            else if ((deltaY - this.initialDeltaY) > panDelay) {
                this.lastPanDirection = "down";
                this.onTabScrollEmitter.emit({direction:this.lastPanDirection});
            }

            this.lastDeltaY = deltaY;
        });
    }

    public onScroll (data: ScrollEventData) {
        if (this.scrollView && this.scrollView.scrollableHeight <= (data.scrollY + 80) && !this.isLoading) {
            this.loadNewWords();
        }
    }

    public loadNewWords (options: IWordQueryOptions = {}) {
        throw new Error ("No overiding method in the nested class!");
    }

    public getWordDate (word: IWord) {
        let currentDate = new Date();
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);

        let inputDate;
        if (word.date) {
            inputDate = new Date(word.date)
            inputDate.setHours(0);
            inputDate.setMinutes(0);
            inputDate.setSeconds(0);
            inputDate.setMilliseconds(0);
        } else {
            return "Mysterious Date";
        }
        let dateDiff = currentDate.getTime() - inputDate.getTime();
        if (currentDate.getTime() == inputDate.getTime()) {
            return "Today";
        } else if (dateDiff <= (24 * 60 * 60 *1000)) {
            return "Yesterday";
        }
        return dateformat(inputDate, "mmmm dS, yyyy");
    }
}