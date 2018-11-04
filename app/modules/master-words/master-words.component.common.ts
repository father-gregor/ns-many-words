import { EventEmitter, Output, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { isAndroid } from "tns-core-modules/platform";
import { connectionType } from "tns-core-modules/connectivity/connectivity";
import { ListView } from "tns-core-modules/ui/list-view";
import { Subject } from "rxjs";

import * as dateformat from "dateformat";

import { IWord, IWordQueryOptions, WordType } from "~/modules/word-box/word-box.definitions";
import { ScrollDirection } from "~/modules/master-words/master-words.interfaces";

import { ConnectionMonitorService } from "~/services/connection-monitor/connection-monitor.service";

export abstract class MasterWordsComponentCommon implements OnInit, AfterViewInit {
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
    @ViewChild("listView") public wordsListView: ElementRef;

    protected listView: ListView;
    protected lastPanDirection: ScrollDirection = "up";
    protected newWordsLoaded$: Subject<void> = new Subject<void>();
    protected tabScroll$: Subject<{direction: ScrollDirection}> = new Subject<{direction: ScrollDirection}>();
    protected lastListViewOffset = 0;
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

    public ngAfterViewInit () {
        if (isAndroid) {
            const intervalId = setInterval(() => {
                this.listView = this.wordsListView && this.wordsListView.nativeElement as ListView;
                if (this.listView && this.listView.android) {
                    clearInterval(intervalId);
                    this.listView.android.setOnScrollListener(new android.widget.AbsListView.OnScrollListener({
                        onScrollStateChanged: () => {},
                        onScroll: () => {
                            const offset = this.listView.android.computeVerticalScrollOffset();
                            if (Math.abs(this.lastListViewOffset - offset) > 1) {
                                this.lastListViewOffset = offset;
                                this.onAndroidListViewScroll();
                            }
                        }
                    }));
                }
            }, 100);
        }
    }

    public ngOnInit () {
        this.newWordsLoaded$.subscribe(() => {
            this.cd.detectChanges();
        });

        this.tabScroll$.subscribe((dir: {direction: ScrollDirection}) => {
            this.onTabScrollEmitter.emit(dir);
        });

        this.ConnectionMonitor.changes$.subscribe((connection: connectionType) => {
            if (!this.noConnectionError && connection === connectionType.none) {
                this.noConnectionError = true;
            }
            else if (this.noConnectionError) {
                this.noConnectionError = false;
                this.loadNewWords();
            }
        });
    }

    public onAndroidListViewScroll () {
        if (this.lastListViewOffset > 0 && this.lastListViewOffset !== this.lastVerticalOffset) {
            let panDelay = 10;

            if ((this.lastPanDirection === "up" && this.lastVerticalOffset < this.lastListViewOffset) || (this.lastPanDirection === "down" && this.lastVerticalOffset > this.lastListViewOffset)) {
                panDelay = 0;
            }

            if (this.lastVerticalOffset + panDelay < this.lastListViewOffset) {
                this.lastVerticalOffset = this.lastListViewOffset;
                this.lastPanDirection = "up";
                this.tabScroll$.next({direction: this.lastPanDirection});
            }
            else if (this.lastVerticalOffset - panDelay > this.lastListViewOffset) {
                this.lastVerticalOffset = this.lastListViewOffset;
                this.lastPanDirection = "down";
                this.tabScroll$.next({direction: this.lastPanDirection});
            }
        }
    }

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
