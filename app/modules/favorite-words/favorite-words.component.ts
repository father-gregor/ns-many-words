import { Component, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { Subscription } from "rxjs";

import { IFavoriteWord } from "~/services/favorite-words/favorite-words";
import { FavoriteWordsService } from "~/services/favorite-words/favorite-words.service";
import { MainConfigService } from "~/services/main-config/main-config.service.js";
import { MasterWordsComponentCommon } from "~/modules/master-words/master-words.component.common";
import { ConnectionMonitorService } from "~/services/connection-monitor/connection-monitor.service.js";
import { WordType } from "~/modules/word-box/word-box.definitions";

@Component({
    selector: "FavoriteWords",
    moduleId: module.id,
    styleUrls: ["./favorite-words-common.css"],
    templateUrl: "./favorite-words.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteWordsComponent extends MasterWordsComponentCommon implements OnInit, OnDestroy {
    public wordsType: WordType = "favorite";
    public favoriteWords: IFavoriteWord[];
    public actionBarTitle: string;
    public noWordsText: string;

    private sub: Subscription;

    constructor (
        public MainConfig: MainConfigService,
        public FavoriteWords: FavoriteWordsService,
        protected ConnectionMonitor: ConnectionMonitorService,
        protected cd: ChangeDetectorRef
    ) {
        super(ConnectionMonitor, cd);
        this.actionBarTitle = this.MainConfig.config.favoritesArchive.title;
        this.noWordsText = this.MainConfig.config.favoritesArchive.noWordsText;
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
