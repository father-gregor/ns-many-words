import { Component } from "@angular/core";
import { Page } from "tns-core-modules/ui/page/page";
import { SearchBar } from "tns-core-modules/ui/search-bar/search-bar";
import { RouterExtensions } from "nativescript-angular/router";

/**
 * Services
 */
import { WordsService } from "../../services/words/words.service";
import { PageDataStorageService } from "../../services/page-data-storage/page-data-storage.service";

/**
 * Interfaces
 */
import { IWord, IWordRouterData } from "../word-box/word-box.interfaces";
import { TextField } from "tns-core-modules/ui/text-field/text-field";

@Component({
    selector: "SearchWords",
    moduleId: module.id,
    styleUrls: ["./search-words-common.scss"],
    templateUrl: "./search-words.html"
})
export class SearchWordsComponent {
    public searchTerm: string;
    public searchItems: IWord[] = [];

    private searchWordsBarTextField: TextField;

    constructor (
        private Words: WordsService,
        private page: Page,
        private PageDataStorage: PageDataStorageService<IWordRouterData>,
        private routerExtensions: RouterExtensions
    ) {
        this.page.actionBarHidden = true;
    }

    public async onSearchTextChange (searchText: string) {
        const searchValue = searchText ? searchText.toLowerCase() : "";

        if (searchValue.length >= 3) {
            const result: any = await this.Words.searchWordByTerm({searchTerm: searchValue}).toPromise();
            this.searchItems = [...result];
        }
        else {
            this.searchItems = [];
        }
    }

    public saveSearchFieldReference (textField: TextField) {
        this.searchWordsBarTextField = textField;
    }

    public dismissSearchFieldKeyboard () {
        if (this.searchWordsBarTextField) {
            this.searchWordsBarTextField.dismissSoftInput();
        }
    }

    public onSearchTermSubmit (args) {
        const searchBar = args.object as SearchBar;
        searchBar.dismissSoftInput();
    }

    public onOpenWordTap (word: IWord) {
        this.dismissSearchFieldKeyboard();

        this.PageDataStorage.current = {word, type: "random"};
        this.routerExtensions.navigate(["/showcase-word"], {
            transition: {
                name: "slideLeft",
                duration: 500,
                curve: "ease"
            }
        });
    }
}
