import { Component, ChangeDetectorRef, NgZone } from "@angular/core";
import {
    getString as nsGetString,
    setString as nsSetString,
    hasKey as nsHasKey
} from "tns-core-modules/application-settings/application-settings";

import { MasterWordsComponentCommon } from "~/modules/master-words/master-words.component.common";
import { IWord, IWordQueryOptions, WordType } from "~/modules/word-box/word-box.definitions";
import { WordsService } from "~/services/words/words.service";
import { ConnectionMonitorService } from "~/services/connection-monitor/connection-monitor.service";

@Component({
    selector: "DailyWords",
    moduleId: module.id,
    styleUrls: ["./daily-words-common.css"],
    templateUrl: "./daily-words.html"
})
export class DailyWordsComponent extends MasterWordsComponentCommon {
    public wordsType: WordType = "daily";
    public earliestWordDate: Date;
    private newestWordDate: Date;
    private newestWordDateKey = "newestDate";

    constructor (
        private Words: WordsService,
        protected ConnectionMonitor: ConnectionMonitorService,
        protected cd: ChangeDetectorRef,
        protected zone: NgZone
    ) {
        super(ConnectionMonitor, cd);
    }

    public async ngOnInit () {
        super.ngOnInit();
        this.earliestWordDate = new Date();
        this.noWordsMsg = "No more words in the archive. New word will be released tomorrow!";
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
        this.showNoWordsMsg = false;
        this.isLoading = true;

        try {
            const res = await this.Words.getDailyWord(query).toPromise();
            let newWords = false;
            if (res && Array.isArray(res)) {
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
                this.showNoWordsMsg = true;
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
            this.showNoWordsMsg = true;
            this.isLoading = false;
            if (this.firstLoading) {
                this.firstLoading = false;
            }
        }
        finally {
            this.newWordsLoaded$.next();
        }
    }
}
