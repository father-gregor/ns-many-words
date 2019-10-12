import { Component, ChangeDetectorRef, ElementRef } from "@angular/core";
import {
    getString as nsGetString,
    setString as nsSetString,
    hasKey as nsHasKey
} from "tns-core-modules/application-settings/application-settings";
import { ProxyViewContainer } from "tns-core-modules/ui/proxy-view-container";

/**
 * Components
 */
import { MasterWordsComponentCommon } from "../master-words/master-words.component.common";

/**
 * Animations
 */
import { masterWordsAnimations } from "../master-words/master-words.animations";

/**
 * Interfaces
 */
import { IWord, IWordQueryOptions, WordType } from "../word-box/word-box.interfaces";

/**
 * Services
 */
import { WordsService } from "../../services/words/words.service";
import { LoggerService } from "../../services/logger/logger.service";
import { LatestWordBox } from "../latest-word-box/latest-word-box.component";
import { View } from "tns-core-modules/ui/core/view";

@Component({
    selector: "DailyWords",
    moduleId: module.id,
    styleUrls: ["./daily-words-common.scss"],
    templateUrl: "../master-words/master-words-template.html",
    animations: [
        ...masterWordsAnimations
    ]
})
export class DailyWordsComponent extends MasterWordsComponentCommon {
    public wordsType: WordType = "daily";
    public noWordsMsg = "No more words in the archive. New word will be released tomorrow!";
    public earliestWordDate: Date;
    private latestWordDate: Date;
    private latestWordDateKey = "latestDate";

    constructor (
        private Words: WordsService,
        protected Logger: LoggerService,
        protected cd: ChangeDetectorRef
    ) {
        super(Logger, cd);
        super.wordsType = this.wordsType;
    }

    public ngOnInit () {
        super.ngOnInit();
        this.earliestWordDate = new Date();
        if (nsHasKey(this.latestWordDateKey)) {
            this.latestWordDate = new Date(JSON.parse(nsGetString(this.latestWordDateKey)));
        }
        this.loadNewWords({ count: 5, checkForLatestWord: true });
    }

    public startLatestWordTeaserAnimation (latestWordBox: LatestWordBox) {
        const latestWordIndex = this.allListItems.findIndex((i) => (i as IWord).latest);
        if (latestWordIndex >= 0) {
            const wordView = latestWordBox.element.nativeElement as View;
            wordView.animate({
                scale: {x: 0.5, y: 0.5},
                opacity: 0,
                duration: 1000
            }).then(() => {
                this.allListItems[latestWordIndex] = {...this.allListItems[latestWordIndex], latest: false};
                this.cd.detectChanges();
            });
        }
    }

    // @Override
    public loadNewWords (options: IWordQueryOptions = {}) {
        if (this.isLoading) {
            return;
        }

        const query = {
            date: this.earliestWordDate.toString(),
            count: options.count || 3
        };
        this.isLoading = true;
        this.addTechItem("loading");
        this.cd.detectChanges();

        this.handleWordsRequest(this.Words.getDailyWord(query), (res: IWord[]) => {
            if (this.isNoWords) {
                this.isNoWords = false;
            }

            if (res && res.length > 0) {
                const resultWords = [];
                for (const word of res) {
                    const newWord = {
                        name: word.name,
                        type: "daily",
                        nameAsId: word.name.replace(/\s/gm, "_").toLowerCase(),
                        definitions: word.definitions,
                        synonyms: word.synonyms,
                        archaic: word.archaic,
                        language: word.language,
                        publishDateUTC: word.publishDateUTC,
                        partOfSpeech: word.partOfSpeech
                    } as IWord;
                    newWord.date = this.getWordDate(word);
                    if (options.checkForLatestWord) {
                        if (!this.latestWordDate || this.latestWordDate.getTime() < newWord.date.object.getTime()) {
                            newWord.latest = true;
                            this.latestWordDate = newWord.date.object;
                            options.checkForLatestWord = false;
                            nsSetString(this.latestWordDateKey, JSON.stringify(this.latestWordDate));
                        }
                    }

                    resultWords.push(newWord);
                }

                // TODO: Remove later
                if (options.checkForLatestWord) {
                    resultWords[0] = {...resultWords[0], latest: true};
                }

                this.earliestWordDate = new Date(resultWords[resultWords.length - 1].publishDateUTC);
                this.allListItems = [...this.allListItems, ...resultWords];
            }
        });
    }
}
