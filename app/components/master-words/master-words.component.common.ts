import { EventEmitter, Output, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy, DoCheck } from "@angular/core";
import { SetupItemViewArgs } from "nativescript-angular/directives";
import { isAndroid } from "tns-core-modules/platform";
import { ListView } from "tns-core-modules/ui/list-view";
import { Subject, Subscription, Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import * as dateformat from "dateformat";

/**
 * Interfaces
 */
import { TabErrorType } from "../errors/errors.interfaces";
import { IWord, IWordQueryOptions, WordType } from "../word-box/word-box.interfaces";
import { ScrollDirection, ITabScrollEvent } from "./master-words.interfaces";

/**
 * Services
 */
import { LoggerService } from "../../services/logger/logger.service";

type TechItemType = "loading" | "noWords" | "header";

export abstract class MasterWordsComponentCommon implements OnInit, AfterViewInit, OnDestroy {
    public wordsType: WordType;
    public currentError: TabErrorType;
    public isNoWords = false;
    public noWordsMsg: string;
    public loadWordsBtnMsg: string = "Repeat";
    public firstLoading = true;
    public isLoading: boolean = false;
    public allListItems: Array<IWord | {techItem: TechItemType}> = [];

    @Output("onTabScroll") public onTabScrollEmitter: EventEmitter<ITabScrollEvent> = new EventEmitter<ITabScrollEvent>();
    @ViewChild("listView", {static: false}) public wordsListView: ElementRef;

    protected listView: ListView;
    protected lastPanDirection: ScrollDirection = "up";
    protected newWordsLoaded$: Subject<void> = new Subject<void>();
    protected lastListViewOffset = 0;
    protected lastVerticalOffset = 0;

    protected subscriptions: Subscription = new Subscription();

    constructor (
        protected Logger: LoggerService,
        protected cd: ChangeDetectorRef
    ) {
        this.cd.detach();
    }

    public ngOnInit () {
        this.subscriptions.add(
            this.newWordsLoaded$.subscribe(() => {
                this.cd.detectChanges();
            })
        );
    }

    public ngAfterViewInit () {
        if (isAndroid) {
            const intervalId = setInterval(() => {
                this.listView = this.wordsListView && this.wordsListView.nativeElement as ListView;
                if (this.listView && this.listView.android) {
                    clearInterval(intervalId);
                    this.listView.android.setFriction(android.view.ViewConfiguration.getScrollFriction() * 4);
                    this.listView.android.setOnScrollListener(new android.widget.AbsListView.OnScrollListener({
                        onScrollStateChanged: () => {
                            const offset = this.listView.android.computeVerticalScrollOffset();
                            if (offset === 0) {
                                this.onTabScrollEmitter.emit({direction: "down"});
                            }
                        },
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

    public ngOnDestroy () {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }

    public preventItemHighlight () {
        return;
    }

    public onAndroidListViewTopScroll () {
        return;
    }

    public onAndroidListViewScroll () {
        const prevOffset = this.lastListViewOffset;
        this.lastListViewOffset = this.listView.android.computeVerticalScrollOffset();
        if (this.lastListViewOffset > 0 && this.lastListViewOffset !== this.lastVerticalOffset) {
            let panDelay = 20;

            if ((this.lastPanDirection === "up" && this.lastVerticalOffset < this.lastListViewOffset) || (this.lastPanDirection === "down" && this.lastVerticalOffset > this.lastListViewOffset)) {
                panDelay = 0;
            }

            const diff = Math.abs(this.lastListViewOffset - prevOffset);
            if (this.lastVerticalOffset + panDelay < this.lastListViewOffset) {
                this.lastVerticalOffset = this.lastListViewOffset;
                this.lastPanDirection = "up";
                if (diff > 0) {
                    this.onTabScrollEmitter.emit({direction: this.lastPanDirection});
                }
            }
            else if (this.lastVerticalOffset - panDelay > this.lastListViewOffset) {
                this.lastVerticalOffset = this.lastListViewOffset;
                this.lastPanDirection = "down";
                this.onTabScrollEmitter.emit({direction: this.lastPanDirection});
            }
        }
    }

    public selectItemTemplate (item: IWord | {techItem: TechItemType}, index: number, items: IWord[]) {
        if ((item as IWord).type === "daily") {
            if ((item as IWord).latest) {
                return "latestDailyWord";
            }
            return "dailyWord";
        }
        else if ((item as any).techItem) {
            return (item as any).techItem;
        }
        else {
            return "defaultWord";
        }
    }

    public async loadNewWordsOnScroll () {
        if (this.isNoWords) {
            return;
        }
        this.loadNewWords({count: 5});
    }

    public abstract async loadNewWords (options?: IWordQueryOptions);

    public startLatestWordTeaserAnimation (LatestWordBox: any) {
        return;
    }

    public handleWordsRequest (words$: Observable<object>, processSuccessResultFn) {
        const sub = words$.pipe(
            finalize(() => {
                const toFilter: TechItemType[] = ["loading"];
                if (!this.isNoWords) {
                    toFilter.push("noWords");
                }
                this.filterTechItems(toFilter);
                this.isLoading = false;
                if (this.firstLoading) {
                    this.firstLoading = false;
                }
                this.newWordsLoaded$.next();
                sub.unsubscribe();
            })
        ).subscribe(
            (res: any[]) => {
                if (res && Array.isArray(res) && res.length > 0) {
                    if (this.firstLoading) {
                        this.addTechItem("header");
                    }
                    processSuccessResultFn(res);
                }
                else {
                    this.addTechItem("noWords");
                    this.isNoWords = true;
                }
            },
            (err) => {
                this.Logger.error("mw_error_try_catch", err);
                if (!this.isNoWords) {
                    if (this.firstLoading) {
                        this.addTechItem("header");
                    }
                    this.isNoWords = true;
                    this.addTechItem("noWords");
                }
                this.currentError = "wordsLoadingFailed";
                sub.unsubscribe();
            }
        );
    }

    public addTechItem (techItem: TechItemType) {
        this.allListItems.push({techItem});
    }

    public filterTechItems (toFilter: TechItemType[]) {
        this.allListItems = this.allListItems.filter((item) => {
            return !(item as any).techItem || !toFilter.includes((item as any).techItem);
        });
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
