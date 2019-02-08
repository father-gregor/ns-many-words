import { Component, ChangeDetectorRef } from "@angular/core";

/**
 * Interfaces
 */
import { IWord, IWordQueryOptions, WordType } from "~/modules/word-box/word-box.definitions";

/**
 * Components
 */
import { MasterWordsComponentCommon } from "~/modules/master-words/master-words.component.common";

/**
 * Services
 */
import { LoggerService } from "~/services/logger/logger.service";
import { WordsService } from "~/services/words/words.service";

@Component({
    selector: "RandomWords",
    moduleId: module.id,
    styleUrls: ["./random-words-common.scss"],
    templateUrl: "./random-words.html"
})
export class RandomWordsComponent extends MasterWordsComponentCommon {
    public wordsType: WordType = "random";
    public noWordsMsg = "Word didn't loaded. Press button to try again";

    constructor (
        private Words: WordsService,
        private logger: LoggerService,
        protected cd: ChangeDetectorRef
    ) {
        super(cd);
    }

   public async ngOnInit () {
       super.ngOnInit();
       await this.loadNewWords({count: 5});
    }

    // @Override
    public async loadNewWords (options: IWordQueryOptions = {}) {
        if (this.isLoading) {
            return;
        }

        const query = {count: options.count || 1};
        this.isLoading = true;

        try {
            const res = await this.Words.getRandomWord(query).toPromise();
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
                this.newWordsLoaded$.next();
            }
            else {
                this.isNoWords = true;
            }
        }
        catch (err) {
            this.logger.error("mw_error_try_catch", err);
            this.isNoWords = true;
            this.currentError = "wordsLoadingFailed";
        }
        finally {
            this.isLoading = false;
            if (this.firstLoading) {
                this.firstLoading = false;
            }
            this.newWordsLoaded$.next();
        }
    }
}
