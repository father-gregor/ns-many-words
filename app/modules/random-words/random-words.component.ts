import { Component, ElementRef, ViewChild } from "@angular/core";
import { ScrollEventData, ScrollView } from "ui/scroll-view";
import { IWord } from "../word-box/word-box";
import { WordsService } from "../../services/words/words.service";
import { MasterWordsClass } from "../master-words/master-words.class";


@Component({
    selector: "RandomWords",
    styleUrls: [],
    templateUrl: "./modules/random-words/random-words.html"
}) 
export class RandomWordsComponent extends MasterWordsClass {
    public randomWords: IWord[] = [];
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
    public loadNewWords () {
        if (this.showNoWordsMsg) {
            this.showNoWordsMsg = false;
        }
        this.isLoading = true;

        this.Words.getRandomWord().subscribe(
            (res: any) => {
                console.dir(res);
                if (res & res.name) {
                    this.randomWords.push({
                        name: res.name,
                        definitions: res.definitions,
                        archaic: res.archaic,
                        language: res.language,
                        date: res.publishDateUTC,
                        partOfSpeech: res.partOfSpeech
                    } as IWord);
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