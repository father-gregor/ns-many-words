import { Component, OnDestroy, OnInit, ChangeDetectorRef, AfterContentInit } from "@angular/core";
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
export class FavoriteWordsComponent extends MasterWordsComponentCommon implements OnInit, AfterContentInit, OnDestroy {
    public wordsType: WordType = "favorite";
    public favoriteWords: IFavoriteWord[];
    public isInitCompleted = false;

    private sub: Subscription;

    constructor (
        public MainConfig: MainConfigService,
        public FavoriteWords: FavoriteWordsService,
        protected Logger: LoggerService,
        protected cd: ChangeDetectorRef
    ) {
        super(MainConfig, Logger, cd);
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

    public ngAfterContentInit () {
        setTimeout(() => {
            this.isInitCompleted = true;
            this.cd.detectChanges();
        }, 700);
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
