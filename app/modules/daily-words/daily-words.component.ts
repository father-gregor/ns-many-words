import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {
    getString as nsGetString,
    setString as nsSetString,
    hasKey as nsHasKey
} from "tns-core-modules/application-settings/application-settings";

import { MasterWordsComponentCommon } from "~/modules/master-words/master-words.component.common";
import { IWord, IWordQueryOptions } from "~/modules/word-box/word-box.definitions";
import { WordsService } from "~/services/words/words.service";
import { ConnectionMonitorService } from '~/services/connection-monitor/connection-monitor.service';

@Component({
    selector: "DailyWords",
    moduleId: module.id,
    styleUrls: ["./daily-words-common.css"],
    templateUrl: "./daily-words.html",
    changeDetection: ChangeDetectionStrategy.OnPush
}) 
export class DailyWordsComponent extends MasterWordsComponentCommon {
    public earliestWordDate: Date;
    private newestWordDate: Date;
    private newestWordDateKey = "newestDate";

    constructor (
        private Words: WordsService, 
        protected ConnectionMonitor: ConnectionMonitorService,
        protected cd: ChangeDetectorRef
    ) {
        super(ConnectionMonitor, cd);
    }

    ngOnInit () {
        super.ngOnInit();
        this.earliestWordDate = new Date();
        this.noWordsMsg = "No more words in the archive. New word will be released tomorrow!";
        if (nsHasKey(this.newestWordDateKey)) {
            this.newestWordDate = JSON.parse(nsGetString(this.newestWordDateKey));
        }

        this.loadNewWords({count: 5, checkForNewestWord: true});
    }

    // @Override
    public loadNewWords (options: IWordQueryOptions = {}) {
        if (!this.isLoading) {
            let query = {
                date: this.earliestWordDate.toString(),
                count: options.count || 3
            };
            this.showNoWordsMsg = false;
            this.isLoading = true;

            this.Words.getDailyWord(query).subscribe((res: any) => {
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
                        } as IWord
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
                    this.earliestWordDate.setDate(this.earliestWordDate.getDate() - query.count);
                    this.newWordsLoaded$.next();
                }
                else {
                    this.showNoWordsMsg = true;
                }

                this.isLoading = false;
                if (this.firstLoading) {
                    this.firstLoading = false;
                }
            }, 
            (error: any) => {
                this.showNoWordsMsg = true;
                this.isLoading = false;
                if (this.firstLoading) {
                    this.firstLoading = false;
                }
                this.newWordsLoaded$.next();
            });
        }
    }
}