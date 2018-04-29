import { Component, Input } from "@angular/core";
import { IWord, WordTypeEnum } from "./word-box.definitions";
import { FavoriteWordsService } from "../../services/favorite-words/favorite-words.service";


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

    constructor(public FavoriteWords: FavoriteWordsService) {}

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

    public onFavoriteTap () {
        if (this.isFavorite()) {
            this.FavoriteWords.remove(this.word, this.type);
        }
        else {
            this.FavoriteWords.add(this.word, this.type);
        }
    }
}