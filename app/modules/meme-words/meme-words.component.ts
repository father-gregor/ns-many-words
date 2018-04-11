import { Component, ElementRef, ViewChild } from "@angular/core";
import { ScrollEventData, ScrollView } from "ui/scroll-view";
import { IWord, IWordQueryOptions } from "../word-box/word-box";
import { WordsService } from "../../services/words/words.service";
import { MasterWordsClass } from "../master-words/master-words.class";


@Component({
    selector: "MemeWords",
    styleUrls: [],
    templateUrl: "./modules/meme-words/meme-words.html"
}) 
export class MemeWordsComponent extends MasterWordsClass {
    public memeWords: IWord[] = [];
    @ViewChild("wordsContainer") public wordsContainer: ElementRef;

    public loadWordBtnMsg: string = "Repeat"

    constructor (private Words: WordsService) {
        super();
    }

   ngOnInit () {
       this.noWordsMsg = "Word didn't loaded. Press button to try again";
       this.scrollView = <ScrollView> this.wordsContainer.nativeElement;
       this.loadNewWords();
    }

    // @Override
    public loadNewWords (options: IWordQueryOptions = {}) {
        if (this.showNoWordsMsg) {
            this.showNoWordsMsg = false;
        }
        let query = {
            count: options.count || 1
        };
        this.isLoading = true;

        this.Words.getMemeWord(query).subscribe(
            (res: any) => {
                if (res && Array.isArray(res)) {
                    for (let word of res) {
                        this.memeWords.push({
                            name: word.name,
                            definitions: word.definitions,
                            archaic: word.archaic,
                            language: word.language,
                            date: word.publishDateUTC,
                            partOfSpeech: word.partOfSpeech
                        } as IWord);
                    }
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