import { Component, Input, ChangeDetectorRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

/**
 * Interfaces
 */
import { IWord, WordType, IWordRouterData } from "./word-box.interfaces";

/**
 * Services
 */
import { FavoriteWordsService } from "../../services/favorite-words/favorite-words.service";
import { PageDataStorageService } from "../../services/page-data-storage/page-data-storage.service";
import { SnackBarNotificationService } from "../../services/snack-bar-notification/snack-bar-notification.service";
import { SocialShareService } from "~/services/social-share/social-share.service";

@Component({
    selector: "WordBox",
    moduleId: module.id,
    styleUrls: ["./word-box-common.scss", "./word-box.scss"],
    templateUrl: "./word-box.html"
})
export class WordBoxComponent {
    public isFavorite: boolean;
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
        private SocialShare: SocialShareService,
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

        this.checkIsFavorite();
    }

    public checkIsFavorite () {
        this.isFavorite = Boolean(this.FavoriteWords.get(this.word, this.type));
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

        if (this.isFavorite) {
            this.FavoriteWords.remove(this.word, this.type).then((isRemoveCancelled: boolean) => {
                if (isRemoveCancelled) {
                    this.checkIsFavorite();
                    this.cd.detectChanges();
                }
            });
            this.checkIsFavorite();
            if (!this.isFavoritePage) {
                this.cd.detectChanges();
            }
        }
        else {
            this.FavoriteWords.add(this.word, this.type);
            this.checkIsFavorite();
            this.cd.detectChanges();
        }
    }

    public onSocialShareTap () {
        this.stopPropagation = true;
        this.SocialShare.shareWord(this.word.name, this.word.definitions[0]);
    }
}
