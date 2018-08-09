import { Subject } from 'rxjs';
import { EventEmitter, Output, OnInit, Component, ElementRef, ViewChild, DoCheck } from '@angular/core';
import { ScrollEventData, ScrollView } from "tns-core-modules/ui/scroll-view/scroll-view";

import { IWord, IWordQueryOptions } from "~/modules/word-box/word-box.definitions";

import * as dateformat from "dateformat";
import { ScrollDirection } from '~/modules/master-words/master-words.interfaces';
import { GestureTypes } from 'tns-core-modules/ui/gestures/gestures';
import { View } from 'tns-core-modules/ui/core/view';

// const dateformat = require("dateformat");
@Component({
    selector: 'MasterWords',
    template: '<section></section>'
})
export class MasterWordsComponentCommon implements OnInit {
    protected scrollView: ScrollView;
    public noWordsMsg: string;
    public showNoWordsMsg: boolean = false;
    public isLoading: boolean = false;

    @Output("onTabScroll") public onTabScrollEmitter: EventEmitter<{scrollYDiff: number, direction: ScrollDirection}> = new EventEmitter<{scrollYDiff: number, direction: ScrollDirection}>();
    @ViewChild("wordsContainer") public wordsContainer: ElementRef;

    protected lastScrollY = 0;

    constructor() {}

    ngOnInit () {
        /* this.scrollEvent$.pipe(throttleTime(50)).subscribe(() => {
            this.onTabScrollEmitter.emit(this.scrollView);
        });*/
        this.scrollView = this.wordsContainer.nativeElement as ScrollView;
        (this.scrollView as View).on(GestureTypes.pan, () => {
            console.log('Scroll Pan');
        });
    }

    public onScroll (data: ScrollEventData) {
        let direction: 'up' | 'down';
        if (Math.abs(data.scrollY - this.lastScrollY) >= 5) {
            if (data.scrollY > this.lastScrollY) {
                direction = 'down';
            }
            else {
                direction = 'up';
            }
            // console.log('ScrollY', data.scrollY);
            this.onTabScrollEmitter.emit({scrollYDiff: Math.floor(Math.abs(data.scrollY - this.lastScrollY)), direction});
            this.lastScrollY = data.scrollY;
        }
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