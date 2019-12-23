import { Component, Input, ChangeDetectorRef, ElementRef, ViewChild, OnChanges } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { View } from "tns-core-modules/ui/core/view";

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
import { SocialShareService } from "../../services/social-share/social-share.service";
import { UtilsService } from "../../services/utils/utils.service";
import { AppThemeService } from "../../services/app-theme/app-theme.service";

@Component({
    selector: "WordBox",
    moduleId: module.id,
    styleUrls: ["./word-box-common.scss", "./word-box.scss"],
    templateUrl: "./word-box.html"
})
export class WordBoxComponent implements OnChanges {
    public cardRippleColor: string;
    @Input() public word: IWord;
    @Input() public type: WordType;
    @Input() public isOnFavoriteWordsPage = false;
    @Input() public disableFavorite: boolean;
    @ViewChild("cardViewElement", {static: false}) public cardViewElement: ElementRef;

    private stopPropagation = false;

    constructor (
        public FavoriteWords: FavoriteWordsService,
        public PageDataStorage: PageDataStorageService<IWordRouterData>,
        public routerExtensions: RouterExtensions,
        public SnackBarService: SnackBarNotificationService,
        private SocialShare: SocialShareService,
        private cd: ChangeDetectorRef,
        AppTheme: AppThemeService
    ) {
        this.cardRippleColor = AppTheme.getCurrent() === "ns-dark" ? "#e5e2e2" : "";
    }

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

    public ngOnChanges () {
        if (this.word.viewState === "latest") {
            const wordView = this.cardViewElement.nativeElement as View;
            wordView.translateX = -300;
            wordView.scaleX = 0.5;
            wordView.scaleY = 0.5;
            this.word.viewState = "default";

            wordView.animate({
                translate: {x: 0, y: 0},
                scale: {x: 1, y: 1},
                duration: 600,
                curve: AnimationCurve.easeOut
            });
        }
    }

    public checkIsFavorite () {
        this.word.isFavorite = Boolean(this.FavoriteWords.get(this.word, this.type));
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

        if (this.word.isFavorite) {
            this.FavoriteWords.remove(this.word, this.type).then((isRemoveCancelled: boolean) => {
                if (isRemoveCancelled) {
                    this.checkIsFavorite();
                    UtilsService.safeDetectChanges(this.cd);
                }
            });
            this.checkIsFavorite();
            if (!this.isOnFavoriteWordsPage) {
                UtilsService.safeDetectChanges(this.cd);
            }
        }
        else {
            this.FavoriteWords.add(this.word, this.type);
            this.checkIsFavorite();
            UtilsService.safeDetectChanges(this.cd);
        }
    }

    public onSocialShareTap () {
        this.stopPropagation = true;
        this.SocialShare.shareWord(this.word.name, this.word.definitions[0]);
    }
}
