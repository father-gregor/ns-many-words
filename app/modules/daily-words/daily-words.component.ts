import { Component, ElementRef, ViewChild } from "@angular/core";
import { ScrollEventData, ScrollView } from "ui/scroll-view";
import { MasterWordsClass } from "../master-words/master-words.class";
import { IWord } from "../word-box/word-box";
import { WordsService } from "../../services/words/words.service";


@Component({
    selector: "DailyWords",
    styleUrls: [],
    templateUrl: "./modules/daily-words/daily-words.html"
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
        this.loadNewWords();
    }

    // @Override
    public loadNewWords () {
        if (!this.isLoading) {
            let query = {
                date: this.earliestWordDate.toString()
            };
            this.isLoading = true;

            this.Words.getDailyWord(query).subscribe((res: any) => {
                console.dir(res);
                if (res && res.name) {
                    this.dailyWords.push({
                        name: res.name,
                        definitions: res.definitions,
                        archaic: res.archaic,
                        language: res.language,
                        date: res.publishDateUTC,
                        partOfSpeech: res.partOfSpeech
                    } as IWord);
    
                    this.earliestWordDate.setDate(this.earliestWordDate.getDate() - 1);
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