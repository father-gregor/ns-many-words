import { EventEmitter, Output, OnInit, ElementRef, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, DoCheck } from '@angular/core';
import { ScrollEventData, ScrollView } from "tns-core-modules/ui/scroll-view/scroll-view";
import { View } from "tns-core-modules/ui/core/view";
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import * as dateformat from "dateformat";

import { IWord, IWordQueryOptions } from "~/modules/word-box/word-box.definitions";
import { ScrollDirection } from "~/modules/master-words/master-words.interfaces";

export abstract class MasterWordsComponentCommon implements OnInit, DoCheck {
    public noWordsMsg: string;
    public showNoWordsMsg: boolean = false;
    public loadWordsBtnMsg: string = "Repeat";
    public firstLoading = true;
    public isLoading: boolean = false;
    public allWords: IWord[] = [];
    public visibleWords: IWord[] = [];

    @Output("onTabScroll") public onTabScrollEmitter: EventEmitter<{direction: ScrollDirection}> = new EventEmitter<{direction: ScrollDirection}>();
    @ViewChild("scrollContainer") public scrollContainer: ElementRef;
    @ViewChildren("wordsList") public wordList: QueryList<ElementRef>;

    protected scrollView: ScrollView;
    protected initialDeltaY = 0;
    protected lastDeltaY = 0; 
    protected lastPanDirection: ScrollDirection;
    protected virtualScroll$: Subject<void> = new Subject<void>();
    protected newWordsLoaded$: Subject<void> = new Subject<void>();
    protected tabScroll$: Subject<{direction: ScrollDirection}> = new Subject<{direction: ScrollDirection}>();
    protected maxVisibleWords = 10;
    protected mostCenteredIndex = 0;

    protected lastVerticalOffset = 0;

    constructor(protected cd: ChangeDetectorRef) {}

    ngOnInit () {
        this.scrollView = this.scrollContainer.nativeElement as ScrollView;

        this.virtualScroll$.pipe(debounceTime(200)).subscribe(() => {
            this.calculateMostCenteredWord();
        });

        this.newWordsLoaded$.subscribe(() => {
            this.cd.detectChanges();
        });

        this.tabScroll$.subscribe((dir: {direction: ScrollDirection}) => {
            this.onTabScrollEmitter.emit(dir);
        });
    }

    ngDoCheck () {
        if (this.scrollView && this.scrollView.verticalOffset > 0) {
            const panDelay = 10;
            this.virtualScroll$.next();
            let currentVerticalOffset = this.scrollView.verticalOffset;

            if (this.lastVerticalOffset + panDelay < currentVerticalOffset) {
                this.lastVerticalOffset = currentVerticalOffset;
                this.tabScroll$.next({direction: "up"});
            }
            else if (this.lastVerticalOffset - panDelay > currentVerticalOffset) {
                this.lastVerticalOffset = currentVerticalOffset;
                this.tabScroll$.next({direction: "down"}); 
            }
        }

        /* REUSE LOGIC FOR CONTINIOUS PAN FOR NGDOCHECK
        this.scrollView.on("pan,swipe", (event: any) => {
            if (event.type === GestureTypes.pan) {
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
            }
        });*/
    }

    public onScroll (data: ScrollEventData) {
        if (this.scrollView && this.scrollView.scrollableHeight <= (data.scrollY + 100) && !this.isLoading) {
            this.loadNewWords();
        }
    }

    public abstract loadNewWords (options?: IWordQueryOptions);

    public getWordDate (word: IWord): {text: string, object: Date} {
        let currentDate = new Date();
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);

        let inputDate;
        if (word.publishDateUTC) {
            inputDate = new Date(word.publishDateUTC)
            inputDate.setHours(0);
            inputDate.setMinutes(0);
            inputDate.setSeconds(0);
            inputDate.setMilliseconds(0);
        } else {
            return {text: "Mysterious Date", object: null};
        }
        let dateDiff = currentDate.getTime() - inputDate.getTime();
        if (currentDate.getTime() == inputDate.getTime()) {
            return {text: "Today", object: inputDate};
        } else if (dateDiff <= (24 * 60 * 60 *1000)) {
            return {text: "Yesterday", object: inputDate};
        }
        return {text: dateformat(inputDate, "mmmm dS, yyyy"), object: inputDate};
    }

    public isWordVisible (word) {
        let wordIndex = this.allWords.findIndex((w) => w === word);
        if (wordIndex > -1) {
            let start = this.mostCenteredIndex - this.maxVisibleWords / 2;
            start = start >= 0 ? start : 0;
            let end = this.mostCenteredIndex + this.maxVisibleWords / 2;
            return wordIndex >= start && wordIndex <= end;
        }
        return false;
    }

    protected calculateMostCenteredWord () {
        let minPos = null;
        let mostCenteredWordId;
        this.wordList.forEach((item: ElementRef) => {
            let wordView = item.nativeElement as View;
            let relativeY = wordView.getLocationRelativeTo(this.scrollView) as any;
            relativeY = relativeY && relativeY.y;
            if (minPos == null) {
                minPos = Math.abs(relativeY);
                mostCenteredWordId = wordView.id.replace("word-stack-", "");
            }
            else if (minPos > Math.abs(relativeY)) {
                minPos = Math.abs(relativeY);
                mostCenteredWordId = wordView.id.replace("word-stack-", "");
            }
        });

        if (mostCenteredWordId) {
            let index = this.allWords.findIndex((w) => w.nameAsId === mostCenteredWordId);
            if (this.mostCenteredIndex !== index) {
                this.mostCenteredIndex = index;
                this.cd.detectChanges();
            }
        }
    }

    /** Unfinished method for efficient virtual scrolling
    protected redrawVisibleWords () {
        let minPos = null;
        let mostCenteredWordId;
        let standardHeight;
        console.log(`Scroll Height - ${this.scrollView.getActualSize().height}`);
        this.wordList.forEach((item: ElementRef) => {
            let wordView = item.nativeElement as View;
            console.log('WORD Actual HEIGHT', wordView.getActualSize().height);
            console.log('WORD Measured HEIGHT', wordView.getMeasuredHeight());
            if (!standardHeight && wordView.getActualSize().height > 0) {
                standardHeight = wordView.getActualSize().height
            }
            let relativeY = wordView.getLocationRelativeTo(this.scrollView).y;
            if (minPos == null) {
                minPos = Math.abs(relativeY);
                mostCenteredWordId = wordView.id.replace("word-stack-", "");
            }
            else if (minPos > Math.abs(relativeY)) {
                minPos = Math.abs(relativeY);
                mostCenteredWordId = wordView.id.replace("word-stack-", "");
            }
        });

        if (mostCenteredWordId) {
            let mostCenteredViewIndex = this.allWords.findIndex((w) => w.nameAsId === mostCenteredWordId);
            let start = mostCenteredViewIndex - this.maxVisibleWords / 2 ;
            start = start >= 0 ? start : 0;
            let end = mostCenteredViewIndex + this.maxVisibleWords / 2
            this.visibleWords = this.allWords.slice(start >= 0 ? start : 0, end <= this.allWords.length - 1 ? end : this.allWords.length - 1);

            if (standardHeight) {
                setTimeout(() => {
                    console.log("Standard height", standardHeight);
                    let marginStart = start - 1 > 0 ? start - 1 : 0;
                    console.log(marginStart);
                    let marginEnd = (this.allWords.length - 1 - end)  > 0 ? (this.allWords.length - 1 - end) : 0;
                    (this.wordsStack.nativeElement as View).marginTop = marginStart > 0 ? marginStart * (standardHeight * 0.1) : 0; 
                    (this.wordsStack.nativeElement as View).marginBottom = end < this.allWords.length ? marginEnd * standardHeight : 0;
                    console.log(`Margin Top ${(this.wordsStack.nativeElement as View).marginTop}; Margin Bottom ${(this.wordsStack.nativeElement as View).marginBottom}`);
                    if ((this.wordsStack.nativeElement as View).marginTop > 0) {
                        this.scrollView.scrollToVerticalOffset(this.scrollView.verticalOffset, false);
                    }
                }, 50);
            }
        }
        else {
            this.visibleWords = [...this.allWords];
        }
        console.log("Scroll height", this.scrollView.scrollableHeight);
        console.log("Verticall offset", this.scrollView.verticalOffset);
    }*/
}