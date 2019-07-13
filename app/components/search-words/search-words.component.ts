import { Component, ViewContainerRef, ViewChild, ElementRef } from "@angular/core";
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { Page } from "tns-core-modules/ui/page/page";

@Component({
    selector: "SearchWords",
    moduleId: module.id,
    styleUrls: ["./search-words-common.scss"],
    templateUrl: "./search-words.html"
})
export class SearchWordsComponent {
    public searchTerm: string;
    @ViewChild("searchBarContainer", {static: false}) public set searchBarContainer (element: ElementRef) {
        if (element) {
        }
    }

    constructor (
        private viewContainer: ViewContainerRef,
        private page: Page
    ) {
        this.page.actionBarHidden = true;
    }

    public onSearchTermChanged (event) {}

    public onSearchTermSubmit (event) {

    }
}
