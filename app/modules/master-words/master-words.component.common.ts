import { EventEmitter, Output, OnInit, ChangeDetectorRef, DoCheck } from "@angular/core";
import { Subject } from "rxjs";
import { connectionType } from "tns-core-modules/connectivity/connectivity";

import * as dateformat from "dateformat";

import { IWord, IWordQueryOptions, WordType } from "~/modules/word-box/word-box.definitions";
import { ScrollDirection } from "~/modules/master-words/master-words.interfaces";

import { ConnectionMonitorService } from "~/services/connection-monitor/connection-monitor.service";
export abstract class MasterWordsComponentCommon implements OnInit, DoCheck {
    private static monitor: ConnectionMonitorService;

    public wordsType: WordType;
    public noWordsMsg: string;
    public showNoWordsMsg: boolean = false;
    public loadWordsBtnMsg: string = "Repeat";
    public firstLoading = true;
    public isLoading: boolean = false;
    public noConnectionError = false;
    public allWords: IWord[] = [];

    @Output("onTabScroll") public onTabScrollEmitter: EventEmitter<{direction: ScrollDirection}> = new EventEmitter<{direction: ScrollDirection}>();

    protected lastPanDirection: ScrollDirection = "up";
    protected newWordsLoaded$: Subject<void> = new Subject<void>();
    protected tabScroll$: Subject<{direction: ScrollDirection}> = new Subject<{direction: ScrollDirection}>();
    protected lastVerticalOffset = 0;

    constructor (
        protected ConnectionMonitor: ConnectionMonitorService,
        protected cd: ChangeDetectorRef
    ) {
        this.cd.detach();

        if (MasterWordsComponentCommon.monitor) {
            ConnectionMonitor = MasterWordsComponentCommon.monitor;
        }
        else {
            MasterWordsComponentCommon.monitor = ConnectionMonitor;
        }
    }

    public ngOnInit () {
        this.newWordsLoaded$.subscribe(() => {
            this.cd.detectChanges();
        });

        /*this.tabScroll$.subscribe((dir: {direction: ScrollDirection}) => {
            this.onTabScrollEmitter.emit(dir);
        });*/

        this.ConnectionMonitor.changes$.subscribe((connection: connectionType) => {
            if (!this.noConnectionError && connection === connectionType.none) {
                this.noConnectionError = true;
                console.log("ERRPRS CONNECTION");
            }
            else if (this.noConnectionError) {
                this.noConnectionError = false;
                this.loadNewWords();
            }
        });
    }

    public ngDoCheck () {
        /*
        const scrollViewOffset = this.scrollView.verticalOffset;
        console.log(`Offset ${scrollViewOffset} at ${this.wordsType}`);
        if (this.scrollView && scrollViewOffset > 0 && scrollViewOffset !== this.lastVerticalOffset) {
            let panDelay = 15;

            /*
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
        }*/
    }

    /*public onScroll (data: ScrollEventData) {
        if (this.scrollView && this.scrollView.scrollableHeight <= (data.scrollY + 100) && !this.isLoading) {
            this.loadNewWords();
        }
    }*/

    public abstract async loadNewWords (options?: IWordQueryOptions);

    public getWordDate (word: IWord): {text: string, object: Date} {
        const currentDate = new Date();
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);

        let inputDate;
        if (word.publishDateUTC) {
            inputDate = new Date(word.publishDateUTC);
            inputDate.setHours(0);
            inputDate.setMinutes(0);
            inputDate.setSeconds(0);
            inputDate.setMilliseconds(0);
        }
        else {
            return {text: "Mysterious Date", object: null};
        }

        const dateDiff = currentDate.getTime() - inputDate.getTime();
        if (currentDate.getTime() === inputDate.getTime()) {
            return {text: "Today", object: inputDate};
        }
        else if (dateDiff <= (24 * 60 * 60 * 1000)) {
            return {text: "Yesterday", object: inputDate};
        }
        return {text: dateformat(inputDate, "mmmm dS, yyyy"), object: inputDate};
    }
}
