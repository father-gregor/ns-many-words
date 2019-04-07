import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

import { PageDataStorageService } from "~/services/page-data-storage/page-data-storage.service";
import { IWord, IWordRouterData, WordType } from "~/modules/word-box/word-box.definitions";
import { FavoriteWordsService } from "~/services/favorite-words/favorite-words.service";
import { MainConfigService } from "~/services/main-config/main-config.service";
import { isAndroid } from "tns-core-modules/ui/page/page";

@Component({
    selector: "ShowcaseWord",
    moduleId: module.id,
    styleUrls: ["./showcase-word-common.scss"],
    templateUrl: "./showcase-word.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowcaseWordComponent implements OnInit {
    public word: IWord;
    public type: WordType;
    public actionBarTitle: string;

    constructor (
        public MainConfig: MainConfigService,
        private FavoriteWords: FavoriteWordsService,
        private PageDataStorage: PageDataStorageService<IWordRouterData>
    ) {
        this.actionBarTitle = this.MainConfig.config.showcaseWord.title;
    }

    public ngOnInit () {
        this.word = this.PageDataStorage.current.word;
        this.type = this.PageDataStorage.current.type;
    }

    public isFavorite () {
        return Boolean(this.FavoriteWords.get(this.word, this.type));
    }

    public makeSelectable (event) {
        if (isAndroid) {
            event.object.nativeView.setTextIsSelectable(true);
        }
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
