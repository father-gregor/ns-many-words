import { Component, Input, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { View } from 'tns-core-modules/ui/core/view';
import { AnimationCurve } from "tns-core-modules/ui/enums";
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

    @ViewChild("wordBox") public wordBoxView: ElementRef;

    constructor(
        public FavoriteWords: FavoriteWordsService,
        public SnackBarService: SnackBarNotificationService,
        public PageDataStorage: PageDataStorageService<IWord>,
        public routerExtensions: RouterExtensions,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit () {
        if (!this.word) {
            this.word = {
                name: "",
                definitions: [],
                date: {text: "", object: new Date()}
            }
        }
    }

    public isFavorite () {
        return Boolean(this.FavoriteWords.get(this.word, this.type));
    }

    public openNewestWord () {
        let wordView = this.wordBoxView.nativeElement as View;
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
            `'${this.word.name}' - ${this.word.definitions[0].toLowerCase()}'`, 
            `Would you like to share word '${this.word.name}' with others?`
        );
    }
}