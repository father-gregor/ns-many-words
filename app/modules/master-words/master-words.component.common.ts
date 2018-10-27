import { EventEmitter, Output, OnInit, ElementRef, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, DoCheck, Optional } from '@angular/core';
import { ScrollEventData, ScrollView } from "tns-core-modules/ui/scroll-view/scroll-view";
import { View } from "tns-core-modules/ui/core/view";
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { connectionType } from 'tns-core-modules/connectivity/connectivity';

import * as dateformat from "dateformat";

import { IWord, IWordQueryOptions } from "~/modules/word-box/word-box.definitions";
import { ScrollDirection } from "~/modules/master-words/master-words.interfaces";
import { ConnectionMonitorService } from '~/services/connection-monitor/connection-monitor.service';

export abstract class MasterWordsComponentCommon implements OnInit, DoCheck {
    public noWordsMsg: string;
    public showNoWordsMsg: boolean = false;
    public loadWordsBtnMsg: string = "Repeat";
    public firstLoading = true;
    public isLoading: boolean = false;
    public noConnectionError = false;
    public allWords: IWord[] = [];
    public visibleWords: IWord[] = [];

    @Output("onTabScroll") public onTabScrollEmitter: EventEmitter<{direction: ScrollDirection}> = new EventEmitter<{direction: ScrollDirection}>();
    @ViewChild("scrollContainer") public scrollContainer: ElementRef;
    @ViewChildren("wordsList") public wordList: QueryList<ElementRef>;

    protected scrollView: ScrollView;
    protected initialDeltaY = 0;
    protected lastDeltaY = 0; 
    protected lastPanDirection: ScrollDirection = "up";
    protected virtualScroll$: Subject<void> = new Subject<void>();
    protected newWordsLoaded$: Subject<void> = new Subject<void>();
    protected tabScroll$: Subject<{direction: ScrollDirection}> = new Subject<{direction: ScrollDirection}>();
    protected maxVisibleWords = 20;
    protected mostCenteredIndex = 0;
    protected lastVerticalOffset = 0;
    protected lastVerticalOffsetBeforeRecalculate = 0;
    protected cardHeight = null;

    private static monitor: ConnectionMonitorService;

    constructor (protected ConnectionMonitor: ConnectionMonitorService, protected cd: ChangeDetectorRef) {
        if (MasterWordsComponentCommon.monitor) {
            ConnectionMonitor = MasterWordsComponentCommon.monitor;
        }
        else {
            MasterWordsComponentCommon.monitor = ConnectionMonitor;
        }
    }

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

        this.ConnectionMonitor.changes$.subscribe((connection: connectionType) => {
            if (!this.noConnectionError && connection === connectionType.none) {
                this.noConnectionError = true;
                console.log("ERRPRS CONNECTION");
                this.cd.detectChanges();
            }
            else if (this.noConnectionError) {
                this.noConnectionError = false;
                this.loadNewWords();
            }
        });
    }

    ngDoCheck () {
        const scrollViewOffset = this.scrollView.verticalOffset;
        if (this.scrollView && scrollViewOffset > 0 && scrollViewOffset !== this.lastVerticalOffset) {
            let panDelay = 15;
            if (Math.abs(this.lastVerticalOffsetBeforeRecalculate - scrollViewOffset) >= this.cardHeight) {
                this.lastVerticalOffsetBeforeRecalculate = scrollViewOffset;
                this.virtualScroll$.next();
            }

            if ((this.lastPanDirection === "up" && this.lastVerticalOffset < scrollViewOffset) || (this.lastPanDirection === "down" && this.lastVerticalOffset > scrollViewOffset)) {
                panDelay = 0;
            }

            if (this.lastVerticalOffset + panDelay < scrollViewOffset) {
                this.lastVerticalOffset = scrollViewOffset;
                this.lastPanDirection = "up";
                this.tabScroll$.next({direction: this.lastPanDirection});
            }
            else if (this.lastVerticalOffset - panDelay > scrollViewOffset) {
                this.lastVerticalOffset = scrollViewOffset;
                this.lastPanDirection = "down";
                this.tabScroll$.next({direction: this.lastPanDirection}); 
            }

            /*let deltaY = Math.round(this.scrollView.verticalOffset);
            if (deltaY - this.lastVerticalOffset < -panDelay || deltaY - this.lastVerticalOffset > panDelay) {
                this.initialDeltaY = 0;
                this.lastVerticalOffset = deltaY;
                this.lastPanDirection = null;
            }

            // If in the continious pan we start moving in the opposite direction
            if (this.lastPanDirection === "up" && deltaY < this.lastVerticalOffset || this.lastPanDirection === "down" && deltaY > this.lastVerticalOffset) {
                this.initialDeltaY = deltaY;
                this.lastPanDirection = null;
            }

            if ((deltaY - this.initialDeltaY) > panDelay) {
                this.lastPanDirection = "up";
                this.onTabScrollEmitter.emit({direction: this.lastPanDirection});
            }
            else if ((deltaY - this.initialDeltaY) < -panDelay) {
                this.lastPanDirection = "down";
                this.onTabScrollEmitter.emit({direction:this.lastPanDirection});
            }

            this.lastVerticalOffset = deltaY;*/
        }
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
        if (this.cardHeight == null && this.wordList.first) {
            this.cardHeight = (this.wordList.first.nativeElement as View).getActualSize().height;
        }
        this.wordList.forEach((item: ElementRef, index: number) => {
            const toCheck = this.mostCenteredIndex > this.maxVisibleWords / 2 ? 
                index >= (this.mostCenteredIndex - this.maxVisibleWords / 2)  && index <= (this.mostCenteredIndex + this.maxVisibleWords / 2) :
                index <= this.maxVisibleWords;
            if (toCheck) {
                let wordView = item.nativeElement as View;
                let relativeY = wordView.getLocationRelativeTo(this.scrollView) as any;
                relativeY = relativeY && relativeY.y;
                if (minPos == null) {
                    minPos = relativeY;
                    mostCenteredWordId = wordView.id.replace("word-stack-", "");
                }
                else if (minPos < 0 && minPos < relativeY || minPos > 0 && minPos > relativeY) {
                    minPos = relativeY;
                    mostCenteredWordId = wordView.id.replace("word-stack-", "");
                }
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
}