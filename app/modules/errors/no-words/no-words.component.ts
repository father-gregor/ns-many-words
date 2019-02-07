import { Component, Input } from "@angular/core";

/**
 * Interfaces
 */
import ITabError from "../errors.interfaces";

@Component({
    selector: "NoWords",
    moduleId: module.id,
    styleUrls: ["./no-words-common.scss"],
    templateUrl: "./no-words.html"
})
export class NoWordsComponent implements ITabError {
    @Input() public errorMessage = "No words found!";

    constructor () {}
}
