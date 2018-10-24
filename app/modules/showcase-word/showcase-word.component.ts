import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import * as mainConfig from "../../config/main.config.json";
import { PageDataStorageService } from '~/services/page-data-storage/page-data-storage.service';
import { IWord, IWordRouterData, WordType } from '~/modules/word-box/word-box.definitions';
import { FavoriteWordsService } from '~/services/favorite-words/favorite-words.service';

@Component({
    selector: "ShowcaseWord",
    moduleId: module.id,
    styleUrls: ["./showcase-word-common.css"],
    templateUrl: "./showcase-word.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowcaseWordComponent implements OnInit {
    public word: IWord;
    public type: WordType;
    public actionBarTitle: string = (mainConfig as any).showcaseWord.title;

    constructor (
        private FavoriteWords: FavoriteWordsService,
        private PageDataStorage: PageDataStorageService<IWordRouterData>
    ) {}

    ngOnInit () {
        this.word = this.PageDataStorage.current.word;
        this.type = this.PageDataStorage.current.type;
    }

    public isFavorite () {
        return Boolean(this.FavoriteWords.get(this.word, this.type));
    }

    public async onFavoriteTap () {
        if (this.isFavorite()) {
            this.FavoriteWords.remove(this.word, this.type);
        }
        else {
            this.FavoriteWords.add(this.word, this.type);
        }
    }
}