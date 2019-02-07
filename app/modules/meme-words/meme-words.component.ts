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
import { WordsService } from "~/services/words/words.service";
import { LoggerService } from "~/services/logger/logger.service";

@Component({
    selector: "MemeWords",
    moduleId: module.id,
    styleUrls: ["./meme-words-common.scss"],
    templateUrl: "./meme-words.html"
})
export class MemeWordsComponent extends MasterWordsComponentCommon {
    public wordsType: WordType = "meme";
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

        if (this.noWords) {
            this.noWords = false;
        }
        const query = {count: options.count || 1};
        this.noWords = false;
        this.isLoading = true;

        try {
            const res = await this.Words.getMemeWord(query).toPromise();
            if (res && Array.isArray(res) && res.length > 0) {
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
                this.noWords = true;
            }

            this.isLoading = false;
            if (this.firstLoading) {
                this.firstLoading = false;
            }
        }
        catch (err) {
            this.logger.error("mw_error_try_catch", err);
            this.noWords = true;
            this.isLoading = false;
            if (this.firstLoading) {
                this.firstLoading = false;
            }
            this.currentError = "wordsLoadingFailed";
        }
        finally {
            this.newWordsLoaded$.next();
        }
    }
}
