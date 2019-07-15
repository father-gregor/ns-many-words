import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { isAndroid } from "tns-core-modules/ui/page/page";

import { PageDataStorageService } from "~/services/page-data-storage/page-data-storage.service";
import { IWord, IWordRouterData, WordType } from "~/components/word-box/word-box.interfaces";
import { FavoriteWordsService } from "~/services/favorite-words/favorite-words.service";
import { MainConfigService } from "~/services/main-config/main-config.service";

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

    constructor (
        public MainConfig: MainConfigService,
        private FavoriteWords: FavoriteWordsService,
        private PageDataStorage: PageDataStorageService<IWordRouterData>,
        private http: HttpClient,
        private cd: ChangeDetectorRef
    ) {}

    public async ngOnInit () {
        this.word = this.PageDataStorage.current.word;
        this.type = this.PageDataStorage.current.type;
        await this.assignWikiUrl();
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

    private async assignWikiUrl () {
        try {
            if (!this.word.wikiUrl && this.word.wikiUrl !== "") {
                const wordWikiUrl = this.MainConfig.config.states.showcaseWord.wikiUrl + this.word.name.toLowerCase().replace(/\s/gm, "_");
                await this.http.get(wordWikiUrl, {responseType: "text"}).toPromise();
                this.word.wikiUrl = wordWikiUrl;
            }
        }
        catch (err) {
            this.word.wikiUrl = "";
        }
        finally {
            this.word = {...this.word};
            this.cd.detectChanges();
        }
    }
}
