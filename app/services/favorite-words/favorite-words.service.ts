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
import { IWord, WordType } from "~/modules/word-box/word-box.definitions";
import { IFavoriteWords, IFavoriteWord } from "~/services/favorite-words/favorite-words";

/**
 * Services
 */
import { LoggerService } from "~/services/logger/logger.service";

@Injectable()
export class FavoriteWordsService {
    public changes$: Subject<IFavoriteWord[]> = new Subject<IFavoriteWord[]>();
    private favoriteWordsArchiveKey: string = "favoriteWords";

    constructor (private logger: LoggerService) {}

    public getAll (): IFavoriteWord[] {
        return this.getFavoriteWordsArchive().words;
    }

    public get (word: IWord, type: WordType): IFavoriteWord {
        return this.getFavoriteWordsArchive().words.find((favoriteElem) => favoriteElem.word.name === word.name && favoriteElem.type === type);
    }

    public add (word: IWord, type: WordType) {
        try {
            const favoritesArchive: IFavoriteWords = this.getFavoriteWordsArchive();
            const isWordExist: boolean = Boolean(favoritesArchive.words.find((favoriteElem) => favoriteElem.word.name === word.name && favoriteElem.type === type));

            if (!isWordExist) {
                favoritesArchive.words.push({
                    word,
                    type
                });
                nsSetString(this.favoriteWordsArchiveKey, JSON.stringify(favoritesArchive));
                this.changes$.next(favoritesArchive.words);
            }
        }
        catch (err) {
            this.logger.error("mw_error_add_favorite", err);
        }
    }

    public remove (word: IWord, type: WordType) {
        try {
            const favoritesArchive: IFavoriteWords = this.getFavoriteWordsArchive();
            const removedWordIndex: number = favoritesArchive.words.findIndex((favoriteElem) => favoriteElem.word.name === word.name && favoriteElem.type === type);

            if (removedWordIndex >= 0) {
                favoritesArchive.words.splice(removedWordIndex, 1);
                nsSetString(this.favoriteWordsArchiveKey, JSON.stringify(favoritesArchive));
                this.changes$.next(favoritesArchive.words);
            }
        }
        catch (err) {
            this.logger.error("mw_error_remove_favorite", err);
        }
    }

    private getFavoriteWordsArchive () {
        return nsHasKey(this.favoriteWordsArchiveKey) ? JSON.parse(nsGetString(this.favoriteWordsArchiveKey)) : {words: []};
    }
}
