import { Component, ChangeDetectorRef } from "@angular/core";
import {
    getString as nsGetString,
    setString as nsSetString,
    hasKey as nsHasKey
} from "tns-core-modules/application-settings/application-settings";
import { View } from "tns-core-modules/ui/core/view";

/**
 * Components
 */
import { MasterWordsComponentCommon } from "../master-words/master-words.component.common";
import { LatestWordBox } from "../../latest-word-box/latest-word-box.component";

/**
 * Interfaces
 */
import { IWord, IWordQueryOptions, WordType } from "../../word-box/word-box.interfaces";

/**
 * Services
 */
import { WordsService } from "../../../services/words/words.service";
import { LoggerService } from "../../../services/logger/logger.service";
import { MainConfigService } from "../../../services/main-config/main-config.service";
import { AppThemeService } from "../../../services/app-theme/app-theme.service";
import { UtilsService } from "../../../services/utils/utils.service";

@Component({
    selector: "DailyWords",
    moduleId: module.id,
    styleUrls: ["./daily-words-common.scss"],
    templateUrl: "../master-words/master-words-template.html"
})
export class DailyWordsComponent extends MasterWordsComponentCommon {
    public wordsType: WordType = "daily";
    public noWordsMsg = "No more words in the archive. New word will be released tomorrow!";
    public earliestWordDate: Date;

    private latestWordDate: Date;
    private latestWordDateKey = "latestDate";

    constructor (
        private Words: WordsService,
        protected MainConfig: MainConfigService,
        protected Logger: LoggerService,
        protected AppTheme: AppThemeService,
        protected cd: ChangeDetectorRef
    ) {
        super(MainConfig, Logger, AppTheme, cd);
        super.wordsType = this.wordsType;

        this.loadingIndicatorSrc = this.MainConfig.config.loadingAnimations.daily;
    }

    public ngOnInit () {
        super.ngOnInit();
        this.earliestWordDate = new Date();
        if (nsHasKey(this.latestWordDateKey)) {
            this.latestWordDate = new Date(JSON.parse(nsGetString(this.latestWordDateKey)));
        }

        this.loadNewWords({count: 10, checkForLatestWord: true});
    }

    public startLatestWordTeaserAnimation (latestWordBox: LatestWordBox) {
        const latestWordIndex = this.allListItems.findIndex((i) => (i as IWord).viewState === "latestPreview");
        if (latestWordIndex >= 0) {
            const wordView = latestWordBox.element.nativeElement as View;
            wordView.animate({
                scale: {x: 0.5, y: 0.5},
                translate: {x: 300, y: 0},
                opacity: 0,
                duration: 1000
            }).then(() => {
                this.allListItems[latestWordIndex] = {...this.allListItems[latestWordIndex], viewState: "latest"};
                UtilsService.safeDetectChanges(this.cd);
            });
        }
    }

    // @Override
    public loadNewWords (options: IWordQueryOptions = {}) {
        if (this.isLoading) {
            return;
        }

        const query = {
            date: this.earliestWordDate.toUTCString(),
            count: options.count || 3
        };
        this.isLoading = true;
        this.addTechItem("loading");
        UtilsService.safeDetectChanges(this.cd);

        this.handleWordsRequest(this.Words.getDailyWord(query), (res: IWord[]) => {
            if (res && res.length > 0) {
                if (this.isNoWords) {
                    this.isNoWords = false;
                }
                const resultWords = [];
                for (const word of res) {
                    const newWord = {
                        name: word.name,
                        type: "daily",
                        nameAsId: word.name.replace(/\s/gm, "_").toLowerCase(),
                        definitions: word.definitions,
                        viewState: "default",
                        synonyms: word.synonyms,
                        archaic: word.archaic,
                        language: word.language,
                        publishDateUTC: word.publishDateUTC,
                        partOfSpeech: word.partOfSpeech
                    } as IWord;

                    newWord.date = this.getWordDate(word);
                    if (options.checkForLatestWord) {
                        if (!this.latestWordDate || this.latestWordDate.getTime() < newWord.date.object.getTime()) {
                            newWord.viewState = "latestPreview";
                            this.latestWordDate = newWord.date.object;
                            options.checkForLatestWord = false;
                            nsSetString(this.latestWordDateKey, JSON.stringify(this.latestWordDate));
                        }
                    }

                    resultWords.push(newWord);
                }

                // TODO: Remove later
                if (options.checkForLatestWord) {
                    resultWords[0] = {...resultWords[0], viewState: "latestPreview"};
                }

                this.earliestWordDate = new Date(resultWords[resultWords.length - 1].publishDateUTC);
                this.earliestWordDate.setUTCHours(this.earliestWordDate.getUTCHours() - 24);
                this.allListItems = [...this.allListItems, ...resultWords];
            }
        });
    }
}
