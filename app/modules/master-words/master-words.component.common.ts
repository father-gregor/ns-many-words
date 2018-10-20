import { EventEmitter, Output, OnInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ScrollEventData, ScrollView } from "tns-core-modules/ui/scroll-view/scroll-view";
import { GestureTypes } from "tns-core-modules/ui/gestures/gestures";
import { View } from "tns-core-modules/ui/core/view";
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import * as dateformat from "dateformat";

import { IWord, IWordQueryOptions } from "~/modules/word-box/word-box.definitions";
import { ScrollDirection } from "~/modules/master-words/master-words.interfaces";

export abstract class MasterWordsComponentCommon implements OnInit {
    public noWordsMsg: string;
    public showNoWordsMsg: boolean = false;
    public loadWordsBtnMsg: string = "Repeat";
    public firstLoading = true;
    public isLoading: boolean = false;
    public allWords: IWord[] = [];
    public visibleWords: IWord[] = [];

    @Output("onTabScroll") public onTabScrollEmitter: EventEmitter<{direction: ScrollDirection}> = new EventEmitter<{direction: ScrollDirection}>();
    @Output("onTabSwipe") public onTabSwipeEmitter: EventEmitter<{direction: ScrollDirection}> = new EventEmitter<{direction: ScrollDirection}>();
    @ViewChild("scrollContainer") public scrollContainer: ElementRef;
    @ViewChildren("wordsList") public wordList: QueryList<ElementRef>;

    protected scrollView: ScrollView;
    protected initialDeltaY = 0;
    protected lastDeltaY = 0; 
    protected lastPanDirection: ScrollDirection;
    protected virtualScroll$: Subject<void> = new Subject<void>();
    protected newWordsLoaded$: Subject<void> = new Subject<void>();
    protected maxVisibleWords = 10;

    constructor() {}

    ngOnInit () {
        const panDelay = 10;
        this.scrollView = this.scrollContainer.nativeElement as ScrollView;

        this.virtualScroll$.pipe(debounceTime(200)).subscribe(() => {
            this.redrawVisibleWords();
        });

        this.newWordsLoaded$.subscribe(() => {
            this.virtualScroll$.next();
        });
        
        this.scrollView.on("pan,swipe", (event: any) => {
            this.virtualScroll$.next();
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

            /* TODO Disable swipe event, as current configuration is working better
            if (event.type === GestureTypes.swipe) {
                lastScrollViewEvent = GestureTypes.swipe;
                console.log('Swipe', event.direction);
                setTimeout(() => {
                    if (lastScrollViewEvent === GestureTypes.swipe) {
                        let direction;
                        if (event.direction === 4) {
                            direction = "up";
                        }
                        else if (event.direction === 8) {
                            direction = "down";
                        }
                        this.onTabSwipeEmitter.emit({direction});
                    }
                }, 500)
            }*/
        });
    }

    public onScroll (data: ScrollEventData) {
        if (this.scrollView && this.scrollView.scrollableHeight <= (data.scrollY + 100) && !this.isLoading) {
            this.loadNewWords();
        }
    }

    public abstract loadNewWords (options?: IWordQueryOptions);

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

    protected redrawVisibleWords () {
        let minPos = null;
        let mostCenteredWordId;
        console.log(`Scroll Height - ${this.scrollView.getActualSize().height}`);
        this.wordList.forEach((item: ElementRef) => {
            let wordView = item.nativeElement as View;
            let relativeY = wordView.getLocationRelativeTo(this.scrollView).y;
            if (minPos == null) {
                minPos = Math.abs(relativeY);
                mostCenteredWordId = wordView.id.replace("word-stack-", "");
            }
            else if (minPos > Math.abs(relativeY)) {
                minPos = Math.abs(relativeY);
                mostCenteredWordId = wordView.id.replace("word-stack-", "");
            }
            console.log(`relativeY - ${relativeY}; word id - ${wordView.id}`);
        });

        if (mostCenteredWordId) {
            let mostCenteredViewIndex = this.allWords.findIndex((w) => w.nameAsId === mostCenteredWordId);
            let start = mostCenteredViewIndex - this.maxVisibleWords / 2 ;
            let end = mostCenteredViewIndex + this.maxVisibleWords / 2
            this.visibleWords = this.allWords.slice(start >= 0 ? start : 0, end <= this.allWords.length - 1 ? end : this.allWords.length - 1);
        }
        else {
            this.visibleWords = [...this.allWords];
        }
    }
}