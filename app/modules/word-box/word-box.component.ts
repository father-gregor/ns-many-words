import { Component } from "@angular/core";
import { IWord } from "./word-box";


@Component({
    selector: "WordBox",
    styleUrls: ["./modules/word-box/word-box-common.css", "./modules/word-box/word-box.css"],
    templateUrl: "./modules/word-box/word-box.html"
})
export class WordBoxComponent {
    public word: IWord;

    constructor() {

    }

    ngOnInit () {
        this.word = {
            selfText: "degradation",
            definition: "a low or downcast state"
        }
    }
}