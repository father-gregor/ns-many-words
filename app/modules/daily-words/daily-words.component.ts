import { Component, ChangeDetectorRef } from "@angular/core";
import {
    getString as nsGetString,
    setString as nsSetString,
    hasKey as nsHasKey
} from "tns-core-modules/application-settings/application-settings";

/**
 * Components
 */
import { MasterWordsComponentCommon } from "~/modules/master-words/master-words.component.common";

/**
 * Interfaces
 */
import { IWord, IWordQueryOptions, WordType } from "~/modules/word-box/word-box.definitions";

/**
 * Services
 */
import { WordsService } from "~/services/words/words.service";
import { LoggerService } from "~/services/logger/logger.service";

@Component({
    selector: "DailyWords",
    moduleId: module.id,
    styleUrls: ["./daily-words-common.scss"],
    templateUrl: "./daily-words.html"
})
export class DailyWordsComponent extends MasterWordsComponentCommon {
    public wordsType: WordType = "daily";
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

    public async ngOnInit () {
        super.ngOnInit();
        this.earliestWordDate = new Date();
        if (nsHasKey(this.newestWordDateKey)) {
            this.newestWordDate = JSON.parse(nsGetString(this.newestWordDateKey));
        }

        await this.loadNewWords({count: 5, checkForNewestWord: true});
    }

    // @Override
    public async loadNewWords (options: IWordQueryOptions = {}) {
        if (this.isLoading) {
            return;
        }

        const query = {
            date: this.earliestWordDate.toString(),
            count: options.count || 3
        };
        this.noWords = false;
        this.isLoading = true;

        try {
            const res = await this.Words.getDailyWord(query).toPromise();
            let newWords = false;
            if (res && Array.isArray(res) && res.length > 0) {
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

                    this.allWords.push(word);
                }
                newWords = true;
            }
            else {
                this.noWords = true;
            }

            this.isLoading = false;
            if (this.firstLoading) {
                this.firstLoading = false;
            }
            if (newWords) {
                this.earliestWordDate.setDate(this.earliestWordDate.getDate() - query.count);
            }
        }
        catch (err) {
            this.logger.error("mw_error_try_catch", err);
            this.noWords = true;
            this.isLoading = false;
            if (this.firstLoading) {
                this.firstLoading = false;
            }
            this.currentError = "wordsLoadingFailed";
        }
        finally {
            this.newWordsLoaded$.next();
        }
    }
}
