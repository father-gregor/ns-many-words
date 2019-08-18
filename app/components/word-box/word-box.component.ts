import { Component, Input, ChangeDetectorRef } from "@angular/core";
import { isIOS } from "tns-core-modules/ui/core/view";
import { RouterExtensions } from "nativescript-angular/router";
import * as SocialShare from "nativescript-social-share";
import * as clipboard from "nativescript-clipboard";

import { IWord, WordType, IWordRouterData } from "./word-box.interfaces";
import { FavoriteWordsService } from "../../services/favorite-words/favorite-words.service";
import { PageDataStorageService } from "../../services/page-data-storage/page-data-storage.service";
import { SnackBarNotificationService } from "../../services/snack-bar-notification/snack-bar-notification.service";

@Component({
    selector: "WordBox",
    moduleId: module.id,
    styleUrls: ["./word-box-common.scss", "./word-box.scss"],
    templateUrl: "./word-box.html"
})
export class WordBoxComponent {
    public hideBeforeConfirm = false;
    @Input() public word: IWord;
    @Input() public type: WordType;
    @Input() public isFavoritePage = false;
    @Input() public disableFavorite: boolean;

    private stopPropagation = false;

    constructor (
        public FavoriteWords: FavoriteWordsService,
        public PageDataStorage: PageDataStorageService<IWordRouterData>,
        public routerExtensions: RouterExtensions,
        public SnackBarService: SnackBarNotificationService,
        private cd: ChangeDetectorRef
    ) {}

    public ngOnInit () {
        if (!this.word) {
            this.word = {
                name: "",
                type: null,
                definitions: [],
                date: {text: "", object: new Date()}
            };
        }
    }

    public isFavorite () {
        return Boolean(this.FavoriteWords.get(this.word, this.type));
    }

    public async copyToClipboard (event, text: string) {
        if (isIOS) {
            if (event.ios.state !== 3) {
                return;
            }
        }
        await clipboard.setText(text);
        this.SnackBarService.showMessage("Copied to clipboard");
    }

    public onOpenWordTap () {
        if (this.stopPropagation) {
            this.stopPropagation = false;
            return;
        }

        this.PageDataStorage.current = {word: this.word, type: this.type};
        this.routerExtensions.navigate(["/showcase-word"], {
            transition: {
                name: "slideLeft",
                duration: 500,
                curve: "ease"
            }
        });
    }

    public async onFavoriteTap () {
        this.stopPropagation = true;

        if (this.isFavorite()) {
            this.FavoriteWords.remove(this.word, this.type);
            if (!this.isFavoritePage) {
                this.cd.detectChanges();
            }
        }
        else {
            this.FavoriteWords.add(this.word, this.type);
            this.cd.detectChanges();
        }
    }

    public onSocialShareTap () {
        this.stopPropagation = true;

        SocialShare.shareText(
            `"${this.word.name}" - ${this.word.definitions[0].toLowerCase()}"`,
            `Would you like to share word "${this.word.name}" with others?`
        );
    }
}
