import { Component, Input, EventEmitter, Output } from "@angular/core";

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
    @Input() public showButton = true;
    @Input() public buttonText = "Repeat";
    @Output("onTap") public onTapEmitter: EventEmitter<void> = new EventEmitter<void>();

    constructor () {}

    public onButtonTap () {
        this.onTapEmitter.emit();
    }
}
