import { Component, ViewChild } from "@angular/core";
import { Page } from "tns-core-modules/ui/page/page";
import { RouterExtensions } from "nativescript-angular/router";
import {
    getString as nsGetString,
    setString as nsSetString,
    hasKey as nsHasKey
} from "tns-core-modules/application-settings/application-settings";

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
import { SearchWordsBarComponent } from "../search-words-bar/search-words-bar.component";

@Component({
    selector: "SearchWords",
    moduleId: module.id,
    styleUrls: ["./search-words-common.scss"],
    templateUrl: "./search-words.html"
})
export class SearchWordsComponent {
    public searchTerm: string;
    public searchItems: IWord[] = [];
    public searchTermArchive = [];
    public isSearchActive = false;
    @ViewChild("searchWordsBarComponent", {static: false, read: SearchWordsBarComponent}) public searchWordsBarComponent: SearchWordsBarComponent;

    public set isSearchInProgress (value: boolean) {
        this._isSearchInProgress = value;
        this.searchWordsBarComponent.isSearchInProgress = value;
    }

    public get isSearchInProgress () {
        return this._isSearchInProgress;
    }

    private _isSearchInProgress = false;
    private searchWordsBarTextField: TextField;
    private searchTermArchiveKey = "searchTermArchive";

    constructor (
        private Words: WordsService,
        private page: Page,
        private PageDataStorage: PageDataStorageService<IWordRouterData>,
        private routerExtensions: RouterExtensions
    ) {
        this.page.actionBarHidden = true;
        if (nsHasKey(this.searchTermArchiveKey)) {
            this.searchTermArchive = JSON.parse(nsGetString(this.searchTermArchiveKey)) as any[];
        }
    }

    public async onSearchTermChange (searchText: string) {
        try {
            const searchValue = searchText ? searchText.toLowerCase() : "";

            if (searchValue.length >= 3) {
                if (!this.isSearchActive) {
                    this.isSearchActive = true;
                }
                this.isSearchInProgress = true;
                const result: any = await this.Words.searchWordByTerm({searchTerm: searchValue}).toPromise();
                this.searchItems = [...result];
                this.isSearchInProgress = false;
            }
            else {
                this.searchItems = [];
                this.isSearchActive = false;
            }
        }
        catch (err) {
            this.isSearchActive = false;
            this.isSearchInProgress = false;
        }
    }

    public onSearchTermArchiveTap (searchTerm: string) {
        this.searchWordsBarComponent.searchBarFieldView.text = searchTerm;
    }

    public saveSearchFieldReference (textField: TextField) {
        this.searchWordsBarTextField = textField;
    }

    public removeSearchTermFromArchive (searchTerm: string) {
        const termIndex = this.searchTermArchive.findIndex((t) => t === searchTerm);
        if (termIndex >= 0) {
            this.searchTermArchive.splice(termIndex, 1);
            nsSetString(this.searchTermArchiveKey, JSON.stringify(this.searchTermArchive));
        }
        return;
    }

    public saveSearchTermToArchive (searchTerm: string) {
        if (searchTerm && searchTerm.length >= 3 && this.searchItems.length > 0 && !this.searchTermArchive.includes(searchTerm)) {
            this.searchTermArchive.unshift(searchTerm);
            if (this.searchTermArchive.length > 10) {
                this.searchTermArchive.pop();
            }
            nsSetString(this.searchTermArchiveKey, JSON.stringify(this.searchTermArchive));
        }
    }

    public dismissSearchFieldKeyboard () {
        if (this.searchWordsBarTextField) {
            this.searchWordsBarTextField.dismissSoftInput();
        }
    }

    public onOpenWordTap (word: IWord) {
        this.dismissSearchFieldKeyboard();
        this.saveSearchTermToArchive(word.name);

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
