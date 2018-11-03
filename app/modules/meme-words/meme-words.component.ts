import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { IWord, IWordQueryOptions, WordType } from '~/modules/word-box/word-box.definitions';
import { MasterWordsComponentCommon } from "~/modules/master-words/master-words.component.common";
import { WordsService } from "~/services/words/words.service";
import { ConnectionMonitorService } from '~/services/connection-monitor/connection-monitor.service';

@Component({
    selector: "MemeWords",
    moduleId: module.id,
    styleUrls: ["./meme-words-common.css"],
    templateUrl: "./meme-words.html",
    changeDetection: ChangeDetectionStrategy.OnPush
}) 
export class MemeWordsComponent extends MasterWordsComponentCommon {
    public wordsType: WordType = "meme";

    constructor (
        private Words: WordsService,
        protected ConnectionMonitor: ConnectionMonitorService,
        protected cd: ChangeDetectorRef
    ) {
        super(ConnectionMonitor, cd);
    }

   async ngOnInit () {
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
        let query = {
            count: options.count || 1
        };
        this.showNoWordsMsg = false;
        this.isLoading = true;

        try {
            const res = await this.Words.getMemeWord(query).toPromise();
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