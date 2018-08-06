import { Component, ElementRef, ViewChild } from "@angular/core";
import { ScrollView } from "tns-core-modules/ui/scroll-view/scroll-view";
import { IWord, IWordQueryOptions } from "~/modules/word-box/word-box.definitions";
import { WordsService } from "~/services/words/words.service";
import { MasterWordsComponentCommon } from "~/modules/master-words/master-words.component.common";

@Component({
    selector: "RandomWords",
    moduleId: module.id,
    styleUrls: ["./random-words-common.css"],
    templateUrl: "./random-words.html"
}) 
export class RandomWordsComponent extends MasterWordsComponentCommon {
    public randomWords: IWord[] = [];

    public loadWordBtnMsg: string = "Repeat"

    constructor (private Words: WordsService) {
        super();

    }

   ngOnInit () {
       super.ngOnInit();
       this.noWordsMsg = "Word didn't loaded. Press button to try again";
       this.scrollView = <ScrollView> this.wordsContainer.nativeElement;
       // TODO Temporaly make three calls to the backend
       this.loadNewWords();
       this.loadNewWords();
       this.loadNewWords();
       console.log("LOADED TEST CONSOLE");
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

        this.Words.getRandomWord(query).subscribe(
            (res: any) => {
                if (res && Array.isArray(res)) {
                    for (let word of res) {
                        this.randomWords.push({
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
            }, 
            (error: any) => {
                this.showNoWordsMsg = true;
                this.isLoading = false;
            });
    }
}