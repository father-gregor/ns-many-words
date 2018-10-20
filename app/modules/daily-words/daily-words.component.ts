import { Component } from '@angular/core';
import { MasterWordsComponentCommon } from "~/modules/master-words/master-words.component.common";
import { IWord, IWordQueryOptions } from "~/modules/word-box/word-box.definitions";
import { WordsService } from "~/services/words/words.service";

@Component({
    selector: "DailyWords",
    moduleId: module.id,
    styleUrls: ["./daily-words-common.css"],
    templateUrl: "./daily-words.html"
}) 
export class DailyWordsComponent extends MasterWordsComponentCommon {
    public earliestWordDate: Date;

    constructor (private Words: WordsService) {
        super();
    }

    ngOnInit () {
        super.ngOnInit();
        this.earliestWordDate = new Date();
        this.noWordsMsg = "No more words in the archive. New word will be released tomorrow!";
        this.loadNewWords({count: 3});
    }

    // @Override
    public loadNewWords (options: IWordQueryOptions = {}) {
        if (!this.isLoading) {
            let query = {
                date: this.earliestWordDate.toString(),
                count: options.count || 1
            };
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
                            date: word.publishDateUTC,
                            partOfSpeech: word.partOfSpeech
                        } as IWord
                        word.namedDate = this.getWordDate(word);
                        this.allWords.push(word);
                    }
                    this.earliestWordDate.setDate(this.earliestWordDate.getDate() - query.count);
                    this.newWordsLoaded$.next();
                } else {
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
            });
        }
    }
}