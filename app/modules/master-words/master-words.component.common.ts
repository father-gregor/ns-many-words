import { EventEmitter, Output, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from "@angular/core";
import { SetupItemViewArgs } from "nativescript-angular/directives";
import { isAndroid } from "tns-core-modules/platform";
import { ListView } from "tns-core-modules/ui/list-view";
import { Subject, Subscription } from "rxjs";

import * as dateformat from "dateformat";

/**
 * Interfaces
 */
import { TabErrorType } from "../errors/errors.interfaces";
import { IWord, IWordQueryOptions, WordType } from "~/modules/word-box/word-box.definitions";
import { ScrollDirection, ITabScrollEvent } from "~/modules/master-words/master-words.interfaces";

export abstract class MasterWordsComponentCommon implements OnInit, AfterViewInit, OnDestroy {
    public wordsType: WordType;
    public currentError: TabErrorType;
    public isNoWords = false;
    public noWordsMsg: string;
    public loadWordsBtnMsg: string = "Repeat";
    public firstLoading = true;
    public isLoading: boolean = false;
    public allWords: IWord[] = [];

    @Output("onTabScroll") public onTabScrollEmitter: EventEmitter<ITabScrollEvent> = new EventEmitter<ITabScrollEvent>();
    @ViewChild("listView") public wordsListView: ElementRef;

    protected listView: ListView;
    protected lastPanDirection: ScrollDirection = "up";
    protected newWordsLoaded$: Subject<void> = new Subject<void>();
    protected tabScroll$: Subject<ITabScrollEvent> = new Subject<ITabScrollEvent>();
    protected lastListViewOffset = 0;
    protected lastVerticalOffset = 0;

    protected subscriptions: Subscription = new Subscription();

    constructor (protected cd: ChangeDetectorRef) {
        this.cd.detach();
    }

    public ngOnInit () {
        this.subscriptions.add(
            this.newWordsLoaded$.subscribe(() => {
                this.cd.detectChanges();
            })
        );

        this.subscriptions.add(
            this.tabScroll$.subscribe((event: {direction: ScrollDirection, steps: number}) => {
                this.onTabScrollEmitter.emit(event);
            })
        );
    }

    public ngOnDestroy () {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
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
                            if (Math.abs(this.lastListViewOffset - offset) > 0) {
                                this.onAndroidListViewScroll();
                            }
                        }
                    }));
                }
            }, 100);
        }
    }

    public onAndroidListViewScroll () {
        const prevOffset = this.lastListViewOffset;
        this.lastListViewOffset = this.listView.android.computeVerticalScrollOffset();
        if (this.lastListViewOffset > 0 && this.lastListViewOffset !== this.lastVerticalOffset) {
            let panDelay = 5;

            if ((this.lastPanDirection === "up" && this.lastVerticalOffset < this.lastListViewOffset) || (this.lastPanDirection === "down" && this.lastVerticalOffset > this.lastListViewOffset)) {
                panDelay = 0;
            }

            const diff = Math.abs(this.lastListViewOffset - prevOffset);
            if (this.lastVerticalOffset + panDelay < this.lastListViewOffset) {
                this.lastVerticalOffset = this.lastListViewOffset;
                this.lastPanDirection = "up";
                if (diff > 0) {
                    this.tabScroll$.next({direction: this.lastPanDirection, steps: diff});
                }
            }
            else if (this.lastVerticalOffset - panDelay > this.lastListViewOffset) {
                this.lastVerticalOffset = this.lastListViewOffset;
                this.lastPanDirection = "down";
                this.tabScroll$.next({direction: this.lastPanDirection, steps: diff});
            }
        }
    }

    public abstract async loadNewWords (options?: IWordQueryOptions);

    public onSetupWordBoxView (event: SetupItemViewArgs) {
        event.view.context.isLast = ((event.index + 1) === this.allWords.length);
    }

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
