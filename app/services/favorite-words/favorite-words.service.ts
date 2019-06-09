import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import {
    getString as nsGetString,
    setString as nsSetString,
    hasKey as nsHasKey
} from "tns-core-modules/application-settings/application-settings";

/**
 * Interfaces
 */
import { IWord, WordType } from "~/components/word-box/word-box.interfaces";
import { IFavoriteWords, IFavoriteWord } from "~/services/favorite-words/favorite-words";

/**
 * Services
 */
import { LoggerService } from "~/services/logger/logger.service";
import { SnackBarNotificationService } from "../snack-bar-notification/snack-bar-notification.service";

@Injectable()
export class FavoriteWordsService {
    public changes$: Subject<IFavoriteWord[]> = new Subject<IFavoriteWord[]>();
    private favoritesArchive: IFavoriteWords;
    private favoriteWordsArchiveKey: string = "favoriteWords";

    constructor (
        private logger: LoggerService,
        private SnackBarService: SnackBarNotificationService
    ) {
        this.favoritesArchive = this.getFavoriteWordsArchive();
    }

    public getAll (): IFavoriteWord[] {
        return this.favoritesArchive.words || [];
    }

    public get (word: IWord, type: WordType): IFavoriteWord {
        return this.favoritesArchive.words.find((favoriteElem) => favoriteElem.word.name === word.name && favoriteElem.type === type);
    }

    public add (word: IWord, type: WordType) {
        try {
            const isWordExist: boolean = Boolean(this.favoritesArchive.words.find((favoriteElem) => favoriteElem.word.name === word.name && favoriteElem.type === type));

            if (!isWordExist) {
                this.favoritesArchive.words.push({
                    word,
                    type
                });
                this.saveFavoriteWordsArchive();
            }
        }
        catch (err) {
            this.logger.error("mw_error_add_favorite", err);
        }
    }

    public remove (word: IWord, type: WordType) {
        try {
            const removedWordIndex: number = this.favoritesArchive.words.findIndex((favoriteElem) => favoriteElem.word.name === word.name && favoriteElem.type === type);
            const removedWord: IFavoriteWord = this.favoritesArchive.words[removedWordIndex];

            if (removedWordIndex >= 0) {
                this.favoritesArchive.words.splice(removedWordIndex, 1);
                this.saveFavoriteWordsArchive();
            }

            this.SnackBarService.showUndoAction(`Removed "${removedWord.word.name}" from favorite list`).then((undo) => {
                if (undo.command === "Action") {
                    this.favoritesArchive.words.splice(removedWordIndex, 0, removedWord);
                    this.saveFavoriteWordsArchive();
                }
            });
        }
        catch (err) {
            this.logger.error("mw_error_remove_favorite", err);
        }
    }

    private saveFavoriteWordsArchive () {
        nsSetString(this.favoriteWordsArchiveKey, JSON.stringify(this.favoritesArchive));
        this.changes$.next(this.favoritesArchive.words);
    }

    private getFavoriteWordsArchive () {
        const defaultArchive = {words: []};
        const nsFavorites: IFavoriteWords = nsHasKey(this.favoriteWordsArchiveKey) ? JSON.parse(nsGetString(this.favoriteWordsArchiveKey)) : defaultArchive;
        if (!nsFavorites.words) {
            nsSetString(this.favoriteWordsArchiveKey, JSON.stringify(defaultArchive));
            return defaultArchive;
        }

        return nsFavorites;
    }
}
