import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";

import { IWord, IWordQueryOptions, WordType } from "~/modules/word-box/word-box.definitions";
import { WordsService } from "~/services/words/words.service";
import { MasterWordsComponentCommon } from "~/modules/master-words/master-words.component.common";
import { ConnectionMonitorService } from "~/services/connection-monitor/connection-monitor.service";

@Component({
    selector: "RandomWords",
    moduleId: module.id,
    styleUrls: ["./random-words-common.css"],
    templateUrl: "./random-words.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RandomWordsComponent extends MasterWordsComponentCommon {
    public wordsType: WordType = "random";

    constructor (
        private Words: WordsService,
        protected ConnectionMonitor: ConnectionMonitorService,
        protected cd: ChangeDetectorRef
    ) {
        super(ConnectionMonitor, cd);
    }

   public async ngOnInit () {
       super.ngOnInit();
       this.noWordsMsg = "Word didn't loaded. Press button to try again";
       // TODO Temporaly make three calls to the backend
       await this.loadNewWords();
       await this.loadNewWords();
       await this.loadNewWords();
    }

    // @Override
    public async loadNewWords (options: IWordQueryOptions = {}) {
        if (this.isLoading) {
            return;
        }

        if (this.showNoWordsMsg) {
            this.showNoWordsMsg = false;
        }
        const query = {
            count: options.count || 1
        };
        this.showNoWordsMsg = false;
        this.isLoading = true;

        try {
            const res = await this.Words.getRandomWord(query).toPromise();
            if (res && Array.isArray(res)) {
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
                this.showNoWordsMsg = true;
            }

            this.isLoading = false;
            if (this.firstLoading) {
                this.firstLoading = false;
            }
        }
        catch (err) {
            this.showNoWordsMsg = true;
            this.isLoading = false;
            if (this.firstLoading) {
                this.firstLoading = false;
            }
        }
        finally {
            this.newWordsLoaded$.next();
        }
    }
}
