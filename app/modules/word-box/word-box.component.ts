import { Component } from "@angular/core";
import { IWord } from "./word-box";


@Component({
    selector: "WordBox",
    styleUrls: ["./modules/word-box/word-box-common.css", "./modules/word-box/word-box.css"],
    templateUrl: "./modules/word-box/word-box.html"
})
export class WordBoxComponent {
    public word: IWord;
    public editable: boolean = false;

    constructor() {

    }

    ngOnInit () {
        this.word = {
            selfText: "degradation",
            definition: "a low or downcast state. the process in which the beauty or quality of something is destroyed or spoiled"
        }
    }
}