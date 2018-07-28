import { Subject } from 'rxjs';
import { EventEmitter, Output, OnInit } from '@angular/core';
import { ScrollEventData, ScrollView } from "tns-core-modules/ui/scroll-view/scroll-view";

import { IWord, IWordQueryOptions } from "../word-box/word-box.definitions";
import { debounceTime } from 'rxjs/operators';

import * as dateformat from "dateformat";

// const dateformat = require("dateformat");

export class MasterWordsClass implements OnInit {
    protected scrollView: ScrollView;
    public noWordsMsg: string;
    public showNoWordsMsg: boolean = false;
    public isLoading: boolean = false;

    @Output("onTabScroll") public onTabScrollEmitter: EventEmitter<ScrollEventData> = new EventEmitter<ScrollEventData>();

    private scrollEvent$: Subject<ScrollEventData> = new Subject<ScrollEventData>();

    constructor() {}

    ngOnInit () {
        this.scrollEvent$.asObservable().pipe(debounceTime(1000)).subscribe((data: ScrollEventData) => {
            this.onTabScrollEmitter.emit(data);

            if (this.scrollView && this.scrollView.scrollableHeight <= (data.scrollY + 80) && !this.isLoading) {
                this.loadNewWords();
            }
        });
    }

    public onScroll (data: ScrollEventData) {
        console.log('Test');
        this.scrollEvent$.next(data);
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