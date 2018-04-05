import { Component, Input } from "@angular/core";
import { IWord } from "./word-box";


@Component({
    selector: "WordBox",
    styleUrls: ["./modules/word-box/word-box-common.css", "./modules/word-box/word-box.css"],
    templateUrl: "./modules/word-box/word-box.html"
})
export class WordBoxComponent {
    @Input() public word: IWord;

    constructor() {

    }

    ngOnInit () {
        if (!this.word) {
            this.word = {
                selfText: "degradation",
                def: "a low or downcast state. the process in which the beauty or quality of something is destroyed or spoiled",
                date: new Date().toUTCString()
            }
        }
    }
}