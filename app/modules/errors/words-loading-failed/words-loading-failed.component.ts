import { Component, Input } from "@angular/core";

/**
 * Interfaces
 */
import ITabError from "../errors.interfaces";

@Component({
    selector: "WordsLoadingFailed",
    moduleId: module.id,
    styleUrls: ["./words-loading-failed-common.scss"],
    templateUrl: "./words-loading-failed.html"
})
export class WordsLoadingFailedComponent implements ITabError {
    @Input() public errorMessage = "Something went wrong! It's probably on our side. Try again a little later";

    constructor () {}
}
