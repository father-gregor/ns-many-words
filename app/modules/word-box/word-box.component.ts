import { Component, Input, ElementRef, ViewChild, ChangeDetectorRef } from "@angular/core";
import { View } from "tns-core-modules/ui/core/view";
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { RouterExtensions } from "nativescript-angular/router";
import * as SocialShare from "nativescript-social-share";

import { IWord, WordType, IWordRouterData } from "~/modules/word-box/word-box.definitions";
import { FavoriteWordsService } from "~/services/favorite-words/favorite-words.service";
import { SnackBarNotificationService } from "~/services/snack-bar-notification/snack-bar-notification.service";
import { PageDataStorageService } from "~/services/page-data-storage/page-data-storage.service";

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

    @ViewChild("wordBox") public wordBoxView: ElementRef;

    constructor (
        public FavoriteWords: FavoriteWordsService,
        public SnackBarService: SnackBarNotificationService,
        public PageDataStorage: PageDataStorageService<IWordRouterData>,
        public routerExtensions: RouterExtensions,
        private cd: ChangeDetectorRef
    ) {}

    public ngOnInit () {
        if (!this.word) {
            this.word = {
                name: "",
                definitions: [],
                date: {text: "", object: new Date()}
            };
        }
    }

    public isFavorite () {
        return Boolean(this.FavoriteWords.get(this.word, this.type));
    }

    public openNewestWord () {
        const wordView = this.wordBoxView.nativeElement as View;
        wordView.animate({
            scale: { x: 0.5, y: 0.5},
            opacity: 0,
            duration: 1000
        }).then(() => {
            this.word = {...this.word, newest: false};
            this.cd.detectChanges();
            wordView.translateX = -300;
            wordView.scaleX = 1;
            wordView.scaleY = 1;
            wordView.opacity = 1;
            wordView.animate({
                translate: { x: 0, y: 0 },
                duration: 600,
                curve: AnimationCurve.easeOut
            });
        });
    }

    public async onFavoriteTap () {
        if (this.isFavorite()) {
            if (this.isFavoritePage) {
                this.hideBeforeConfirm = true;
            }
            else {
                this.FavoriteWords.remove(this.word, this.type);
            }
            this.cd.detectChanges();
            const undo = await this.SnackBarService.showUndoAction(`Removed "${this.word.name}" from favorite list`);
            if (undo.command === "Action") {
                this.hideBeforeConfirm = false;
                this.cd.detectChanges();
            } else if (this.isFavoritePage) {
                this.FavoriteWords.remove(this.word, this.type);
            }
        }
        else {
            this.FavoriteWords.add(this.word, this.type);
            this.cd.detectChanges();
        }
    }

    public onOpenWordTap () {
        this.PageDataStorage.current = {word: this.word, type: this.type};
        this.routerExtensions.navigate(["/showcase-word"], {
            transition: {
                name: "slideLeft",
                duration: 500,
                curve: "ease"
            }
        });
    }

    public onSocialShareTap () {
        SocialShare.shareText(
            `"${this.word.name}" - ${this.word.definitions[0].toLowerCase()}"`,
            `Would you like to share word "${this.word.name}" with others?`
        );
    }
}
