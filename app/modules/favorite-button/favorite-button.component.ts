import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";


// import { IWord, WordTypeEnum } from "../word-box/word-box";
import { FavoriteWordsService } from "../../services/favorite-words/favorite-words.service";

@Component({
    selector: "FavoriteButton",
    moduleId: module.id,
    styleUrls: [],
    templateUrl: "./favorite-button.html"
})
export class FavoriteButtonComponent {
    @Input() public word: any;// IWord;
    @Input() public type: any;// WordTypeEnum;

    constructor (public FavoriteWords: FavoriteWordsService) {}

    public onFavoriteTap() {
        this.FavoriteWords.add(this.word, this.type);
    }

    public onUnfavoriteTap() {
        this.FavoriteWords.remove(this.word, this.type);
    }
}