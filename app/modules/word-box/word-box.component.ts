import { Component, Input } from "@angular/core";
import { IWord } from "./word-box";


@Component({
    selector: "WordBox",
    moduleId: module.id,
    styleUrls: ["./word-box-common.css", "./word-box.css"],
    templateUrl: "./word-box.html"
})
export class WordBoxComponent {
    @Input() public word: IWord;

    constructor() {

    }

    ngOnInit () {
        if (!this.word) {
            this.word = {
                name: "degradation",
                definitions: ["a low or downcast state. the process in which the beauty or quality of something is destroyed or spoiled"],
                date: new Date().toUTCString()
            }
        }
    }
}