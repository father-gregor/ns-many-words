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

@Component({
    selector: "SearchWords",
    moduleId: module.id,
    styleUrls: ["./search-words-common.scss"],
    templateUrl: "./search-words.html"
})
export class SearchWordsComponent {
    public searchTerm: string;
    public searchItems: IWord[] = [];

    constructor (
        private Words: WordsService,
        private page: Page,
        private PageDataStorage: PageDataStorageService<IWordRouterData>,
        private routerExtensions: RouterExtensions
    ) {
        this.page.actionBarHidden = true;
    }

    public async onSearchTermChanged (args) {
        const searchBar = args.object as SearchBar;
        if (!searchBar.text) {
            return;
        }

        const searchValue = searchBar.text.toLowerCase();

        if (searchValue.length >= 3) {
            const result: any = await this.Words.searchWordByTerm({searchTerm: searchValue}).toPromise();
            this.searchItems = [...result];
        }
    }

    public onSearchTermSubmit (args) {
        const searchBar = args.object as SearchBar;
        searchBar.dismissSoftInput();
    }

    public onOpenWordTap (word: IWord) {
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
