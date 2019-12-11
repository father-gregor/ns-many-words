import { Component, ChangeDetectorRef } from "@angular/core";

/**
 * Interfaces
 */
import { IWord, IWordQueryOptions, WordType } from "../../word-box/word-box.interfaces";

/**
 * Components
 */
import { MasterWordsComponentCommon } from "../master-words/master-words.component.common";

/**
 * Animations
 */
import { masterWordsAnimations } from "../master-words/master-words.animations";

/**
 * Services
 */
import { WordsService } from "../../../services/words/words.service";
import { LoggerService } from "../../../services/logger/logger.service";
import { MainConfigService } from "../../../services/main-config/main-config.service";
import { AppThemeService } from "../../../services/app-theme/app-theme.service";

@Component({
    selector: "MemeWords",
    moduleId: module.id,
    styleUrls: ["./meme-words-common.scss"],
    templateUrl: "../master-words/master-words-template.html",
    animations: [...masterWordsAnimations]
})
export class MemeWordsComponent extends MasterWordsComponentCommon {
    public wordsType: WordType = "meme";
    public noWordsMsg = "Word didn't loaded. Press 'Repeat' to try again";

    constructor (
        private Words: WordsService,
        protected MainConfig: MainConfigService,
        protected Logger: LoggerService,
        protected cd: ChangeDetectorRef,
        protected AppTheme: AppThemeService
    ) {
        super(MainConfig, Logger, AppTheme, cd);
        super.wordsType = this.wordsType;

        this.loadingIndicatorSrc = this.MainConfig.config.loadingAnimations.meme;
    }

    public ngOnInit () {
        super.ngOnInit();
        this.firstLoading = true;
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

        this.handleWordsRequest(this.Words.getMemeWord(query), (res: any[]) => {
            if (res && res.length > 0 && this.isNoWords) {
                this.isNoWords = false;
            }
            for (const word of res) {
                this.allListItems.push({
                    name: word.name,
                    type: "meme",
                    nameAsId: word.name.replace(/\s/gm, "_").toLowerCase(),
                    definitions: word.definitions,
                    synonyms: word.synonyms,
                    archaic: word.archaic,
                    language: word.language,
                    date: word.publishDateUTC,
                    partOfSpeech: word.partOfSpeech
                } as IWord);
            }
        });
    }
}