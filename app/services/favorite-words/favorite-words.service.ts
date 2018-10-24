import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

import {
    getString as nsGetString,
    setString as nsSetString,
    hasKey as nsHasKey
} from "tns-core-modules/application-settings/application-settings";

import { IWord, WordType } from "~/modules/word-box/word-box.definitions";
import { IFavoriteWords, IFavoriteWord } from "~/services/favorite-words/favorite-words";

@Injectable()
export class FavoriteWordsService {
    public changes$: Subject<IFavoriteWord[]> = new Subject<IFavoriteWord[]>();
    private favoriteWordsArchiveKey: string = "favoriteWords";

    constructor () {}

    public getAll (): IFavoriteWord[] {
        return this.getFavoriteWordsArchive().words;
    }

    public get (word: IWord, type: WordType): IFavoriteWord {
        return this.getFavoriteWordsArchive().words.find((favoriteElem) => favoriteElem.word.name === word.name && favoriteElem.type === type);
    }

    public add (word: IWord, type: WordType) {
        try {
            let favoritesArchive: IFavoriteWords = this.getFavoriteWordsArchive();
            let isWordExist: boolean = Boolean(favoritesArchive.words.find((favoriteElem) => favoriteElem.word.name === word.name && favoriteElem.type === type));

            if (!isWordExist) {
                favoritesArchive.words.push({
                    word,
                    type
                });
                nsSetString(this.favoriteWordsArchiveKey, JSON.stringify(favoritesArchive));
                this.changes$.next(favoritesArchive.words);
            }
        } catch (err) {
            console.log(`Error! ${err.message}`);
        }
    }

    public remove (word: IWord, type: WordType) {
        try {
            let favoritesArchive: IFavoriteWords = this.getFavoriteWordsArchive();
            let removedWordIndex: number = favoritesArchive.words.findIndex((favoriteElem) => favoriteElem.word.name === word.name && favoriteElem.type === type);

            if (removedWordIndex >= 0) {
                favoritesArchive.words.splice(removedWordIndex, 1);
                nsSetString(this.favoriteWordsArchiveKey, JSON.stringify(favoritesArchive));
                this.changes$.next(favoritesArchive.words);
            }
        } catch (err) {
            console.log(`Error! ${err.message}`);
        }
    }

    private getFavoriteWordsArchive () {
        return nsHasKey(this.favoriteWordsArchiveKey) 
            ? JSON.parse(nsGetString(this.favoriteWordsArchiveKey)) 
            : {
                words: []
            };
    }
}