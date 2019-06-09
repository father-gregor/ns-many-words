import { Component, ChangeDetectorRef } from "@angular/core";
import { finalize } from "rxjs/operators";

/**
 * Interfaces
 */
import { IWord, IWordQueryOptions, WordType } from "~/components/word-box/word-box.interfaces";

/**
 * Components
 */
import { MasterWordsComponentCommon } from "~/components/master-words/master-words.component.common";

/**
 * Services
 */
import { LoggerService } from "~/services/logger/logger.service";
import { WordsService } from "~/services/words/words.service";

@Component({
    selector: "RandomWords",
    moduleId: module.id,
    styleUrls: ["../master-words/master-words-common.scss", "./random-words-common.scss"],
    templateUrl: "../master-words/master-words-template.html"
})
export class RandomWordsComponent extends MasterWordsComponentCommon {
    public wordsType: WordType = "random";
    public className = "random-word-container";
    public noWordsMsg = "Word didn't loaded. Press button to try again";

    constructor (
        private Words: WordsService,
        private logger: LoggerService,
        protected cd: ChangeDetectorRef
    ) {
        super(cd);
    }

   public ngOnInit () {
       super.ngOnInit();
       this.loadNewWords({count: 10});
    }

    // @Override
    public loadNewWords (options: IWordQueryOptions = {}) {
        if (this.isLoading) {
            return;
        }

        const query = {count: options.count || 1};
        this.isLoading = true;
        this.cd.detectChanges();

        this.Words.getRandomWord(query).pipe(
            finalize(() => {
                this.isLoading = false;
                if (this.firstLoading) {
                    this.firstLoading = false;
                }
                this.newWordsLoaded$.next();
            })
        ).subscribe(
            (res) => {
                if (res && Array.isArray(res) && res.length > 0) {
                    if (this.isNoWords) {
                        this.isNoWords = false;
                    }

                    for (const word of res) {
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
                }
                else {
                    this.isNoWords = true;
                }
            },
            (err) => {
                this.logger.error("mw_error_try_catch", err);
                this.isNoWords = true;
                this.currentError = "wordsLoadingFailed";
            }
        );
    }
}
