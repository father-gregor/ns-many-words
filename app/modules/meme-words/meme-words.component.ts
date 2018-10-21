import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { IWord, IWordQueryOptions } from "~/modules/word-box/word-box.definitions";
import { WordsService } from "~/services/words/words.service";
import { MasterWordsComponentCommon } from "~/modules/master-words/master-words.component.common";

@Component({
    selector: "MemeWords",
    moduleId: module.id,
    styleUrls: ["./meme-words-common.css"],
    templateUrl: "./meme-words.html",
    changeDetection: ChangeDetectionStrategy.OnPush
}) 
export class MemeWordsComponent extends MasterWordsComponentCommon {
    constructor (private Words: WordsService, protected cd: ChangeDetectorRef) {
        super(cd);
    }

   ngOnInit () {
       super.ngOnInit();
       this.noWordsMsg = "Word didn't loaded. Press button to try again";
       // TODO Temporaly make three calls to the backend
       this.loadNewWords();
       this.loadNewWords();
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
                        this.allWords.push({
                            name: word.name,
                            nameAsId: word.name.replace(/\s/gm, "_").toLowerCase(),
                            definitions: word.definitions,
                            archaic: word.archaic,
                            language: word.language,
                            date: word.publishDateUTC,
                            partOfSpeech: word.partOfSpeech
                        } as IWord);
                    }
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