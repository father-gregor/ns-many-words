import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import * as mainConfig from "../../config/main.config.json";

import { IFavoriteWord } from '~/services/favorite-words/favorite-words';
import { FavoriteWordsService } from "~/services/favorite-words/favorite-words.service";
import { MasterWordsComponentCommon } from "~/modules/master-words/master-words.component.common";

@Component({
    selector: "FavoriteWords",
    moduleId: module.id,
    styleUrls: ["./favorite-words-common.css"],
    templateUrl: "./favorite-words.html"
}) 
export class FavoriteWordsComponent extends MasterWordsComponentCommon implements OnInit, OnDestroy {
    public favoriteWords: IFavoriteWord[];
    public actionBarTitle: string = (mainConfig as any).favoritesArchive.title;
    public noWordsText = (mainConfig as any).favoritesArchive.noWordsText;

    private sub: Subscription

    constructor (public FavoriteWords: FavoriteWordsService, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    ngOnInit () {
        this.favoriteWords = this.FavoriteWords.getAll();

        this.sub = this.FavoriteWords.changes$.subscribe((words: IFavoriteWord[]) => {
            this.favoriteWords = words;
        });
    }

    ngOnDestroy () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    public loadNewWords () {
        return;
    }
}