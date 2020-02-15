import { OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, Input } from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";
import { isAndroid } from "tns-core-modules/platform";
import { on as applicationOn, off as applicationOff, launchEvent, suspendEvent, resumeEvent } from "tns-core-modules/application";
import { ListView } from "tns-core-modules/ui/list-view";
import { Visibility } from "tns-core-modules/ui/page/page";
import { Subject, Subscription, Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import * as dateformat from "dateformat";

/**
 * Interfaces
 */
import { TabErrorType } from "../../errors/errors.interfaces";
import { IWord, IWordQueryOptions, WordType } from "../../word-box/word-box.interfaces";

/**
 * Services
 */
import { LoggerService } from "../../../services/logger/logger.service";
import { MainConfigService } from "../../../services/main-config/main-config.service";
import { AppThemeService } from "../../../services/app-theme/app-theme.service";
import { UtilsService } from "../../../services/utils/utils.service";
import { GoogleFirebaseService } from "../../../services/google-firebase/google-firebase.service";
import { CurrentTabService } from "../../../services/current-tab/current-tab.service";

type TechItemType = "loading" | "noWords" | "header" | "marginForAds";

interface ITechItem {
    techItem: TechItemType;
}

let wordsSuspendAppCallback;
let wordsResumeAppCallback;

export abstract class MasterWordsComponentCommon implements OnInit, OnDestroy {
    public wordsType: WordType;
    public currentError: TabErrorType;
    public isNoWords = false;
    public noWordsMsg: string;
    public loadWordsBtnMsg: string = "Repeat";
    public firstLoading = true;
    public isLoading: boolean = false;
    public allListItems: Array<IWord | ITechItem> = [];
    public loadingIndicatorSrc: string;
    public visibilityStatus: Visibility = "visible";

    @Input() public actionBarHeight = 0;
    @Input("isVisible") set isVisibleInput (value: boolean) {
        if (value && this.visibilityStatus !== "visible") {
            this.visibilityStatus = "visible";
            UtilsService.safeDetectChanges(this.cd);
        }
        else if (!value && this.visibilityStatus !== "collapse") {
            this.visibilityStatus = "collapse";
            UtilsService.safeDetectChanges(this.cd);
        }
    }

    @ViewChild("listView", {static: false}) public set wordsListView (el: ElementRef) {
        if (el) {
            this.listView = el.nativeElement as ListView;
            this.listViewLoaded$.next();

            if (isAndroid && this.listView.android && this.listView.android.setFriction) {
                this.listView.android.setFriction(android.view.ViewConfiguration.getScrollFriction() * 4);
            }
        }
    }
    protected listView: ListView;
    protected isAdsEnabled: boolean;
    protected adId = "WORDS_TAB_AD";
    protected newWordsLoaded$: Subject<void> = new Subject<void>();
    protected listViewLoaded$: Subject<void> = new Subject<void>();

    protected subscriptions: Subscription = new Subscription();

    constructor (
        protected MainConfig: MainConfigService,
        protected Logger: LoggerService,
        protected GoogleFirebase: GoogleFirebaseService,
        protected AppTheme: AppThemeService,
        protected cd: ChangeDetectorRef,
        protected router: Router,
        protected CurrentTab: CurrentTabService
    ) {
        this.loadingIndicatorSrc = this.MainConfig.config.loadingAnimations[this.AppTheme.isDarkModeEnabled() ? "defaultDark" : "default"];
        this.isAdsEnabled = this.MainConfig.config.isAdsEnabled;
        if (this.wordsType !== "favorite") {
            this.router.events.subscribe((event: Event) => {
                if (event instanceof NavigationEnd && event.url !== "/home") {
                    this.GoogleFirebase.hideAdBanner(this.adId);
                }
            });
        }

        this.subscribeToApplicationEvents();
        this.cd.detach();
    }

    public ngOnInit () {
        this.subscriptions.add(
            this.newWordsLoaded$.subscribe(() => {
                UtilsService.safeDetectChanges(this.cd);
            })
        );
    }

    public ngOnDestroy () {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
        this.unsubscribeFromApplicationEvents();
    }

    public preventItemHighlight () {
        return;
    }

    public selectItemTemplate (item: IWord | {techItem: TechItemType}, index: number, items: IWord[]) {
        if ((item as IWord).type === "daily") {
            if ((item as IWord).viewState === "latestPreview") {
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
        if (!this.allListItems.find((i: ITechItem) => i.techItem === techItem)) {
            this.allListItems.push({techItem});
        }
    }

    public filterTechItems (toFilter: TechItemType[]) {
        this.allListItems = this.allListItems.filter((item) => {
            return !(item as any).techItem || !toFilter.includes((item as any).techItem);
        });
    }

    public showAdBanner () {
        if (this.isAdsEnabled) {
            this.GoogleFirebase.showAdBanner(this.adId, {
                margins: {top: this.actionBarHeight}
            }).then((adClosed$: Subject<void>) => {
                this.setMarginForAds();
                if (adClosed$) {
                    adClosed$.subscribe(() => {
                        this.turnOffAds();
                    });
                }
            });
        }
    }

    public hideAdBanner () {
        this.GoogleFirebase.hideAdBanner(this.adId);
        this.turnOffAds();
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

    protected turnOffAds () {
        const itemIndex = this.allListItems.findIndex((item: ITechItem) => item.techItem === "marginForAds");
        if (itemIndex >= 0) {
            this.allListItems.splice(itemIndex, 1);
        }
    }

    protected setMarginForAds () {
        if (this.allListItems.find((i: ITechItem) => i.techItem === "marginForAds")) {
            return;
        }

        if (this.listView) {
            this.allListItems.unshift({techItem: "marginForAds"});
            UtilsService.safeDetectChanges(this.cd);
        }
        else if (!this.listView) {
            const sub = this.listViewLoaded$.subscribe(() => {
                sub.unsubscribe();
                this.allListItems.unshift({techItem: "marginForAds"});
                UtilsService.safeDetectChanges(this.cd);
            });
        }
    }

    private subscribeToApplicationEvents () {
        if (wordsSuspendAppCallback || wordsResumeAppCallback) {
            this.unsubscribeFromApplicationEvents();
        }
        wordsSuspendAppCallback = () => {
            this.hideAdBanner();
        };
        applicationOn(suspendEvent, wordsSuspendAppCallback);

        wordsResumeAppCallback = () => {
            if (this.router.url === "/home" && this.CurrentTab.getCurrent().id !== "daily" || this.wordsType === "favorite") {
                this.showAdBanner();
            }
        };
        applicationOn(resumeEvent, wordsResumeAppCallback);
    }

    private unsubscribeFromApplicationEvents () {
        applicationOff(suspendEvent, wordsSuspendAppCallback);
        applicationOff(resumeEvent, wordsResumeAppCallback);
        wordsSuspendAppCallback = null;
        wordsResumeAppCallback = null;
    }
}
