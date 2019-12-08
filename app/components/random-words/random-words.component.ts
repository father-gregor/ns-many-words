import { Component, ChangeDetectorRef } from "@angular/core";

/**
 * Interfaces
 */
import { IWord, IWordQueryOptions, WordType } from "../word-box/word-box.interfaces";
import { IWordTab } from "../home/tab";

/**
 * Components
 */
import { MasterWordsComponentCommon } from "../master-words/master-words.component.common";

/**
 * Animations
 */
import { masterWordsAnimations } from "../master-words/master-words.animations";

/**
 * Services
 */
import { LoggerService } from "../../services/logger/logger.service";
import { WordsService } from "../../services/words/words.service";
import { CurrentTabService } from "../../services/current-tab/current-tab.service";
import { MainConfigService } from "../../services/main-config/main-config.service";

@Component({
    selector: "RandomWords",
    moduleId: module.id,
    styleUrls: ["./random-words-common.scss"],
    templateUrl: "../master-words/master-words-template.html",
    animations: [
        ...masterWordsAnimations
    ]
})
export class RandomWordsComponent extends MasterWordsComponentCommon {
    public wordsType: WordType = "random";
    public noWordsMsg = "Word didn't loaded. Press 'Repeat' to try again";

    private isFirstVisit = true;

    constructor (
        private Words: WordsService,
        protected MainConfig: MainConfigService,
        protected Logger: LoggerService,
        protected cd: ChangeDetectorRef,
        private CurrentTab: CurrentTabService
    ) {
        super(MainConfig, Logger, cd);
        super.wordsType = this.wordsType;

        this.loadingIndicatorSrc = this.MainConfig.config.loadingAnimations.random;
    }

   public ngOnInit () {
       super.ngOnInit();
       this.loadNewWords({count: 10});

       this.subscriptions.add(
            this.CurrentTab.tabChanged$.subscribe((currentTab: IWordTab) => {
                if (currentTab && currentTab.id === "random") {
                    if (this.isFirstVisit) {
                        this.isFirstVisit = false;
                    }
                    else if (!this.isFirstVisit) {
                        this.allListItems = [];
                        this.firstLoading = true;
                        this.loadNewWords({count: 10});
                    }
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
        this.cd.detectChanges();

        this.handleWordsRequest(this.Words.getRandomWord(query), (res: any[]) => {
            if (res && res.length > 0 && this.isNoWords) {
                this.isNoWords = false;
            }

            for (const word of res) {
                this.allListItems.push({
                    name: word.name,
                    type: "random",
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
