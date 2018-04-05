import { Component, ElementRef, ViewChild } from "@angular/core";
import { ScrollEventData, ScrollView } from "ui/scroll-view";
import { IWord } from "../word-box/word-box";
import { WordsService } from "../../services/words/words.service";


@Component({
    selector: "RandomWords",
    styleUrls: [],
    templateUrl: "./modules/random-words/random-words.html"
}) 
export class RandomWordsComponent {
    public randomWords: IWord[] = [];
    @ViewChild("wordsContainer") public wordsContainer: ElementRef;
    private scrollView: ScrollView;

    constructor (private Words: WordsService) {
    }

   ngOnInit () {
        this.scrollView = <ScrollView> this.wordsContainer.nativeElement;
        this.loadNewWord();
    }

    public onScroll (data: ScrollEventData) {
        console.log("scrollX: " + data.scrollX);
        console.log("scrollY: " + data.scrollY);
        console.log(this.scrollView.scrollableHeight);
        if (this.scrollView.scrollableHeight === data.scrollY) {
            this.loadNewWord();
        }
    }

    public loadNewWord () {
        this.Words.getRandomWord().subscribe((res: any) => {
            console.dir(res);
            if (res && res.word) {
                this.randomWords.push({
                    selfText: res.word,
                    def: res.def,
                    date: res.t
                } as IWord);
                console.log('Pushed');
            }
        });
    }

    public getWordDate (word: IWord) {
        return word.date;
    }
}