import { Component, OnDestroy, OnInit, ChangeDetectorRef } from "@angular/core";
import { Subscription } from "rxjs";

/**
 * Interfaces
 */
import { IFavoriteWord } from "../../services/favorite-words/favorite-words";
import { WordType } from "../word-box/word-box.interfaces";

/**
 * Components
 */
import { MasterWordsComponentCommon } from "../master-words/master-words.component.common";

/**
 * Services
 */
import { FavoriteWordsService } from "../../services/favorite-words/favorite-words.service";
import { MainConfigService } from "../../services/main-config/main-config.service";
import { LoggerService } from "../../services/logger/logger.service";

@Component({
    selector: "FavoriteWords",
    moduleId: module.id,
    styleUrls: ["./favorite-words-common.scss"],
    templateUrl: "./favorite-words.html"
})
export class FavoriteWordsComponent extends MasterWordsComponentCommon implements OnInit, OnDestroy {
    public wordsType: WordType = "favorite";
    public favoriteWords: IFavoriteWord[];

    private sub: Subscription;

    constructor (
        public MainConfig: MainConfigService,
        public FavoriteWords: FavoriteWordsService,
        protected Logger: LoggerService,
        protected cd: ChangeDetectorRef
    ) {
        super(Logger, cd);
        this.noWordsMsg = this.MainConfig.config.states.favoritesArchive.noWordsText;
    }

    public ngOnInit () {
        this.favoriteWords = this.FavoriteWords.getAll();
        this.cd.detectChanges();

        this.sub = this.FavoriteWords.changes$.subscribe((words: IFavoriteWord[]) => {
            this.favoriteWords = words;
            this.cd.detectChanges();
            this.newWordsLoaded$.next();
        });
    }

    public ngOnDestroy () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    public loadNewWords () {
        return;
    }
}
