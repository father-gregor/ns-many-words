import { Component, OnDestroy, OnInit, ChangeDetectorRef, AfterContentInit } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { Subscription } from "rxjs";

/**
 * Interfaces
 */
import { IFavoriteWord } from "../../../services/favorite-words/favorite-words";
import { WordType } from "../../word-box/word-box.interfaces";

/**
 * Components
 */
import { MasterWordsComponentCommon } from "../master-words/master-words.component.common";

/**
 * Services
 */
import { FavoriteWordsService } from "../../../services/favorite-words/favorite-words.service";
import { MainConfigService } from "../../../services/main-config/main-config.service";
import { LoggerService } from "../../../services/logger/logger.service";
import { AppThemeService } from "../../../services/app-theme/app-theme.service";
import { UtilsService } from "../../../services/utils/utils.service";
import { GoogleFirebaseService } from "../../../services/google-firebase/google-firebase.service";

@Component({
    selector: "FavoriteWords",
    moduleId: module.id,
    styleUrls: ["./favorite-words-common.scss"],
    templateUrl: "./favorite-words.html",
    animations: [
        trigger("wordUnfavorite", [
            transition(":leave", [
                style({transform: "translateX(0)"}),
                animate("800ms ease-out", style({transform: "translateX(500)"}))
            ])
        ])
    ]
})
export class FavoriteWordsComponent extends MasterWordsComponentCommon implements OnInit, AfterContentInit, OnDestroy {
    public wordsType: WordType = "favorite";
    public favoriteWords: IFavoriteWord[];
    public isInitCompleted = false;

    private sub: Subscription;

    constructor (
        public MainConfig: MainConfigService,
        public FavoriteWords: FavoriteWordsService,
        protected GoogleFirebase: GoogleFirebaseService,
        protected Logger: LoggerService,
        protected AppTheme: AppThemeService,
        protected cd: ChangeDetectorRef
    ) {
        super(MainConfig, Logger, GoogleFirebase, AppTheme, cd);
        this.noWordsMsg = this.MainConfig.config.states.favoritesArchive.noWordsText;
    }

    public ngOnInit () {
        this.favoriteWords = this.FavoriteWords.getAll();
        UtilsService.safeDetectChanges(this.cd);

        this.sub = this.FavoriteWords.changes$.subscribe((words: IFavoriteWord[]) => {
            this.favoriteWords = words;
            UtilsService.safeDetectChanges(this.cd);
            this.newWordsLoaded$.next();
        });
    }

    public ngAfterContentInit () {
        setTimeout(() => {
            this.isInitCompleted = true;
            UtilsService.safeDetectChanges(this.cd);
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
