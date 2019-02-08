import { Component, OnDestroy, OnInit, ChangeDetectorRef } from "@angular/core";
import { Subscription } from "rxjs";

/**
 * Interfaces
 */
import { IFavoriteWord } from "~/services/favorite-words/favorite-words";
import { WordType } from "~/modules/word-box/word-box.definitions";

/**
 * Components
 */
import { MasterWordsComponentCommon } from "~/modules/master-words/master-words.component.common";

/**
 * Services
 */
import { FavoriteWordsService } from "~/services/favorite-words/favorite-words.service";
import { MainConfigService } from "~/services/main-config/main-config.service";

@Component({
    selector: "FavoriteWords",
    moduleId: module.id,
    styleUrls: ["./favorite-words-common.scss"],
    templateUrl: "./favorite-words.html"
})
export class FavoriteWordsComponent extends MasterWordsComponentCommon implements OnInit, OnDestroy {
    public wordsType: WordType = "favorite";
    public favoriteWords: IFavoriteWord[];
    public actionBarTitle: string;

    private sub: Subscription;

    constructor (
        public MainConfig: MainConfigService,
        public FavoriteWords: FavoriteWordsService,
        protected cd: ChangeDetectorRef
    ) {
        super(cd);
        this.actionBarTitle = this.MainConfig.config.favoritesArchive.title;
        this.noWordsMsg = this.MainConfig.config.favoritesArchive.noWordsText;
    }

    public ngOnInit () {
        this.favoriteWords = this.FavoriteWords.getAll();
        this.cd.detectChanges();

        this.sub = this.FavoriteWords.changes$.subscribe((words: IFavoriteWord[]) => {
            this.favoriteWords = words;
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
