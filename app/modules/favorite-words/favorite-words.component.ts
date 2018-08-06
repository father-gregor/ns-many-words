import { Component } from "@angular/core";

import { IFavoriteWords } from "~/services/favorite-words/favorite-words";
import { FavoriteWordsService } from "~/services/favorite-words/favorite-words.service";
import * as mainConfig from "../../config/main.config.json";
import { MasterWordsComponentCommon } from "~/modules/master-words/master-words.component.common";

@Component({
    selector: "FavoriteWords",
    moduleId: module.id,
    styleUrls: [],
    templateUrl: "./favorite-words.html"
}) 
export class FavoriteWordsComponent extends MasterWordsComponentCommon {
    public favoriteWords: IFavoriteWords;
    public actionBarTitle: string = (mainConfig as any).favoritesArchive.title;

    constructor (public FavoriteWords: FavoriteWordsService) {
        super();
    }

    ngOnInit () {
        this.favoriteWords = this.FavoriteWords.getAll();
    }
}