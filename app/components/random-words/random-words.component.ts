import { Component, ChangeDetectorRef } from "@angular/core";

/**
 * Interfaces
 */
import { IWord, IWordQueryOptions, WordType } from "~/components/word-box/word-box.interfaces";

/**
 * Components
 */
import { MasterWordsComponentCommon } from "~/components/master-words/master-words.component.common";

/**
 * Animations
 */
import { masterWordsAnimations } from "../master-words/master-words.animations";

/**
 * Services
 */
import { LoggerService } from "~/services/logger/logger.service";
import { WordsService } from "~/services/words/words.service";

@Component({
    selector: "RandomWords",
    moduleId: module.id,
    styleUrls: ["./random-words-common.scss"],
    templateUrl: "../master-words/master-words-template.html",
    animations: [
        ...masterWordsAnimations
    ]
})
export class RandomWordsComponent extends MasterWordsComponentCommon {
    public wordsType: WordType = "random";
    public noWordsMsg = "Word didn't loaded. Press button to try again";

    constructor (
        private Words: WordsService,
        protected Logger: LoggerService,
        protected cd: ChangeDetectorRef
    ) {
        super(Logger, cd);
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
        this.addTechItem("loading");
        this.cd.detectChanges();

        this.handleWordsRequest(this.Words.getRandomWord(query), (res: any[]) => {
            if (this.isNoWords) {
                this.isNoWords = false;
            }

            for (const word of res) {
                this.allListItems.push({
                    name: word.name,
                    type: "random",
                    nameAsId: word.name.replace(/\s/gm, "_").toLowerCase(),
                    definitions: word.definitions,
                    archaic: word.archaic,
                    language: word.language,
                    date: word.publishDateUTC,
                    partOfSpeech: word.partOfSpeech
                } as IWord);
            }
        });
    }
}
