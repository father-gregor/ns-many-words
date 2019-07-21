import { Component, ChangeDetectorRef } from "@angular/core";
import {
    getString as nsGetString,
    setString as nsSetString,
    hasKey as nsHasKey
} from "tns-core-modules/application-settings/application-settings";

/**
 * Components
 */
import { MasterWordsComponentCommon } from "~/components/master-words/master-words.component.common";

/**
 * Animations
 */
import { masterWordsAnimations } from "../master-words/master-words.animations";

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
    private newestWordDate: Date;
    private newestWordDateKey = "newestDate";

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
        this.addTechItem("loading");
        this.cd.detectChanges();

        this.handleWordsRequest(this.Words.getDailyWord(query), (res: IWord[]) => {
            if (this.isNoWords) {
                this.isNoWords = false;
            }

            const resultWords = [];
            for (let word of res) {
                word = {
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

            this.allListItems = [...this.allListItems, ...resultWords];
            this.earliestWordDate.setDate(this.earliestWordDate.getDate() - query.count);
        });
    }
}
