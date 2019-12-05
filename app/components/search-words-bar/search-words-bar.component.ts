import { Component, ViewChild, ElementRef, Output, EventEmitter, Input } from "@angular/core";
import { TextField } from "tns-core-modules/ui/text-field/text-field";

@Component({
    selector: "SearchWordsBar",
    moduleId: module.id,
    styleUrls: ["./search-words-bar.scss"],
    templateUrl: "./search-words-bar.html"
})
export class SearchWordsBarComponent {
    public searchBarFieldView: TextField;
    @Input() public isSearchInProgress = false;
    @Output("onSearchFieldLoaded") public onSearchFieldLoadedEmitter: EventEmitter<TextField> = new EventEmitter<TextField>();
    @Output("onSearchTextChange") public onSearchTextChangeEmitter: EventEmitter<string> = new EventEmitter<string>();
    @Output("onConfirmSearchTap") public onConfirmSearchTapEmitter: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild("searchBarField", {static: false}) public set searchBarFieldElementSetter (el: ElementRef) {
        if (!this.searchBarFieldView) {
           this.searchBarFieldView = el.nativeElement as TextField;
           setTimeout(() => {
                this.searchBarFieldView.focus();
                this.onSearchFieldLoadedEmitter.emit(this.searchBarFieldView);
           }, 10);
        }
    }

    constructor () {}

    public onSearchTextChange () {
        this.onSearchTextChangeEmitter.emit(this.searchBarFieldView.text);
    }

    public onConfirmSearchTap () {
        this.onConfirmSearchTapEmitter.emit(this.searchBarFieldView.text);
    }

    public dismissKeyboard () {
        this.searchBarFieldView.dismissSoftInput();
    }

    public clearSearchField () {
        this.searchBarFieldView.text = "";
        this.onSearchTextChangeEmitter.emit(this.searchBarFieldView.text);
        this.searchBarFieldView.focus();
    }
}