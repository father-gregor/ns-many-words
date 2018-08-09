import { Component, Input } from "@angular/core";
import { RouterExtensions } from 'nativescript-angular/router';
import * as SocialShare from "nativescript-social-share";

import { IWord, WordTypeEnum } from "~/modules/word-box/word-box.definitions";
import { FavoriteWordsService } from "~/services/favorite-words/favorite-words.service";
import { SnackBarNotificationService } from "~/services/snack-bar-notification/snack-bar-notification.service";
import { PageDataStorageService } from '~/services/page-data-storage/page-data-storage.service';

@Component({
    selector: "WordBox",
    moduleId: module.id,
    styleUrls: ["./word-box-common.css", "./word-box.css"],
    templateUrl: "./word-box.html"
})
export class WordBoxComponent {
    @Input() public word: IWord;
    @Input() public type: WordTypeEnum;
    @Input() public disableFavorite: boolean;
    private favorite: boolean;

    constructor(
        public FavoriteWords: FavoriteWordsService,
        public SnackBarService: SnackBarNotificationService,
        public PageDataStorage: PageDataStorageService<IWord>,
        public routerExtensions: RouterExtensions
    ) {}

    ngOnInit () {
        if (!this.word) {
            this.word = {
                name: "degradation",
                definitions: ["a low or downcast state. the process in which the beauty or quality of something is destroyed or spoiled"],
                date: new Date().toUTCString()
            }
        }
    }

    public isFavorite () {
        return Boolean(this.FavoriteWords.get(this.word, this.type));
    }

    public async onFavoriteTap () {
        let undo;
        if (this.isFavorite()) {
            this.FavoriteWords.remove(this.word, this.type);
            undo = await this.SnackBarService.showUndoAction(`Removed '${this.word.name}' from favorite list`);
            if (undo.command === 'Action') {
                this.FavoriteWords.add(this.word, this.type);
            }
        }
        else {
            this.FavoriteWords.add(this.word, this.type);
            undo = await this.SnackBarService.showUndoAction(`Added '${this.word.name}' to favorite list`);
            if (undo.command === 'Action') {
                this.FavoriteWords.remove(this.word, this.type);
            }
        }
    }

    public onOpenWordTap () {
        this.PageDataStorage.current = this.word;
        this.routerExtensions.navigate(['showcase-word'], {
            transition: {
                name: "slideLeft",
                duration: 500,
                curve: "ease"
            }
        });
    }

    public onSocialShareTap () {
        SocialShare.shareText(
            `'${this.word.name}' - ${this.word.definitions[0]}'`, 
            `Would you like to share word '${this.word.name}' with others?`
        );
    }
}