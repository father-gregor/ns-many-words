import { Component, ElementRef, ViewChild } from "@angular/core";
import { ScrollEventData, ScrollView } from "ui/scroll-view";
import { MasterWordsClass } from "../master-words/master-words.class";
import { IWord, IWordQueryOptions } from "../word-box/word-box";
import { WordsService } from "../../services/words/words.service";

@Component({
    selector: "DailyWords",
    moduleId: module.id,
    styleUrls: ["./daily-words-common.css"],
    templateUrl: "./daily-words.html"
}) 
export class DailyWordsComponent extends MasterWordsClass {
    public dailyWords: IWord[] = [];
    @ViewChild("wordsContainer") public wordsContainer: ElementRef;

    public earliestWordDate: Date;

    constructor (private Words: WordsService) {
        super();
    }

    ngOnInit () {
        this.earliestWordDate = new Date();
        this.noWordsMsg = "No more words in the archive. New word will be released tomorrow!";
        this.scrollView = <ScrollView> this.wordsContainer.nativeElement;
        this.loadNewWords({
            count: 3
        });
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
                        this.dailyWords.push({
                            name: word.name,
                            definitions: word.definitions,
                            archaic: word.archaic,
                            language: word.language,
                            date: word.publishDateUTC,
                            partOfSpeech: word.partOfSpeech
                        } as IWord);
                    }
                    this.earliestWordDate.setDate(this.earliestWordDate.getDate() - query.count);
                } else {
                    this.showNoWordsMsg = true;
                }
                this.isLoading = false;
            }, (error: any) => {
                this.showNoWordsMsg = true;
                this.isLoading = false;
            });
        }
    }
}