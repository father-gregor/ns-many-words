import { Component, ChangeDetectorRef } from "@angular/core";
import {
    getString as nsGetString,
    setString as nsSetString,
    hasKey as nsHasKey
} from "tns-core-modules/application-settings/application-settings";
import { finalize } from "rxjs/operators";

/**
 * Components
 */
import { MasterWordsComponentCommon } from "~/components/master-words/master-words.component.common";

/**
 * Interfaces
 */
import { IWord, IWordQueryOptions, WordType } from "~/components/word-box/word-box.interfaces";

/**
 * Services
 */
import { WordsService } from "~/services/words/words.service";
import { LoggerService } from "~/services/logger/logger.service";

@Component({
    selector: "DailyWords",
    moduleId: module.id,
    styleUrls: ["../master-words/master-words-common.scss", "./daily-words-common.scss"],
    templateUrl: "../master-words/master-words-template.html"
})
export class DailyWordsComponent extends MasterWordsComponentCommon {
    public wordsType: WordType = "daily";
    public className = "daily-words-container";
    public noWordsMsg = "No more words in the archive. New word will be released tomorrow!";
    public earliestWordDate: Date;
    private newestWordDate: Date;
    private newestWordDateKey = "newestDate";

    constructor (
        private Words: WordsService,
        private logger: LoggerService,
        protected cd: ChangeDetectorRef
    ) {
        super(cd);
    }

    public ngOnInit () {
        super.ngOnInit();
        this.earliestWordDate = new Date();
        if (nsHasKey(this.newestWordDateKey)) {
            this.newestWordDate = JSON.parse(nsGetString(this.newestWordDateKey));
        }
        this.loadNewWords({count: 5, checkForNewestWord: true});
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
        this.cd.detectChanges();

        this.Words.getDailyWord(query).pipe(
            finalize(() => {
                this.isLoading = false;
                if (this.firstLoading) {
                    this.firstLoading = false;
                }
                this.newWordsLoaded$.next();
            })
        ).subscribe(
            (res) => {
                let newWords = false;
                if (res && Array.isArray(res) && res.length > 0) {
                    if (this.isNoWords) {
                        this.isNoWords = false;
                    }

                    const resultWords = [];
                    for (let word of res) {
                        word = {
                            name: word.name,
                            nameAsId: word.name.replace(/\s/gm, "_").toLowerCase(),
                            definitions: word.definitions,
                            archaic: word.archaic,
                            language: word.language,
                            publishDateUTC: word.publishDateUTC,
                            partOfSpeech: word.partOfSpeech
                        } as IWord;
                        word.date = this.getWordDate(word);
                        if (options.checkForNewestWord) {
                            if (!this.newestWordDate || this.newestWordDate.getTime() < word.date.object.getTime()) {
                                word.newest = true;
                                this.newestWordDate = word.date.object;
                                options.checkForNewestWord = false;
                                // nsSetString(this.newestWordDateKey, word.date.object); TODO Commented out for development only
                            }
                        }

                        resultWords.push(word);
                    }

                    this.allWords = this.allWords.concat(resultWords);
                    newWords = true;
                }
                else {
                    this.isNoWords = true;
                }

                if (newWords) {
                    this.earliestWordDate.setDate(this.earliestWordDate.getDate() - query.count);
                }
            },
            (err) => {
                this.logger.error("mw_error_try_catch", err);
                this.isNoWords = true;
                this.currentError = "wordsLoadingFailed";
            }
        );
    }
}
