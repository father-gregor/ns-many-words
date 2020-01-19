import { Component, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";

/**
 * Interfaces
 */
import { IWord, IWordQueryOptions, WordType } from "../../word-box/word-box.interfaces";
import { IWordTab } from "../../home/tab.interfaces";

/**
 * Components
 */
import { MasterWordsComponentCommon } from "../master-words/master-words.component.common";

/**
 * Services
 */
import { WordsService } from "../../../services/words/words.service";
import { LoggerService } from "../../../services/logger/logger.service";
import { MainConfigService } from "../../../services/main-config/main-config.service";
import { AppThemeService } from "../../../services/app-theme/app-theme.service";
import { UtilsService } from "../../../services/utils/utils.service";
import { GoogleFirebaseService } from "../../../services/google-firebase/google-firebase.service";
import { CurrentTabService } from "../../../services/current-tab/current-tab.service";

@Component({
    selector: "MemeWords",
    moduleId: module.id,
    styleUrls: ["./meme-words-common.scss"],
    templateUrl: "../master-words/master-words-template.html"
})
export class MemeWordsComponent extends MasterWordsComponentCommon {
    public wordsType: WordType = "meme";
    public noWordsMsg = "Word didn't loaded. Press 'Repeat' to try again";

    constructor (
        private Words: WordsService,
        protected MainConfig: MainConfigService,
        protected Logger: LoggerService,
        protected GoogleFirebase: GoogleFirebaseService,
        protected cd: ChangeDetectorRef,
        protected AppTheme: AppThemeService,
        protected router: Router,
        private CurrentTab: CurrentTabService
    ) {
        super(MainConfig, Logger, GoogleFirebase, AppTheme, cd, router);
        super.wordsType = this.wordsType;

        this.loadingIndicatorSrc = this.MainConfig.config.loadingAnimations.meme;
    }

    public ngOnInit () {
        super.ngOnInit();
        this.firstLoading = true;
        this.loadNewWords({count: 10});

        this.subscriptions.add(
            this.CurrentTab.tabChanged$.subscribe((currentTab: IWordTab) => {
                if (currentTab && currentTab.id === "meme") {
                    this.showAdBanner();
                }
            })
       );
    }

    // @Override
    public loadNewWords (options: IWordQueryOptions = {}) {
        if (this.isLoading) {
            return;
        }

        const query = {count: options.count || 1};
        this.isLoading = true;
        this.addTechItem("loading");
        UtilsService.safeDetectChanges(this.cd);

        this.handleWordsRequest(this.Words.getMemeWord(query), (res: any[]) => {
            if (res && res.length > 0 && this.isNoWords) {
                this.isNoWords = false;
            }
            for (const word of res) {
                this.allListItems.push({
                    name: word.name,
                    type: "meme",
                    nameAsId: word.name.replace(/\s/gm, "_").toLowerCase(),
                    definitions: word.definitions,
                    synonyms: word.synonyms,
                    archaic: word.archaic,
                    language: word.language,
                    date: word.publishDateUTC,
                    partOfSpeech: word.partOfSpeech
                } as IWord);
            }
        });
    }
}
