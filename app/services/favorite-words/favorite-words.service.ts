import { Injectable } from "@angular/core";

import {
    getString as nsGetString,
    setString as nsSetString,
    hasKey as nsHasKey,
    remove as nsRemove
} from "application-settings";

import * as mainConfig from "../../config/main.config.json";
import { IWord, WordTypeEnum } from "../../modules/word-box/word-box.definitions";
import { IFavoriteWords, IFavoriteWord } from "./favorite-words";

@Injectable()
export class FavoriteWordsService {
    private favoriteWordsArchiveKey: string = "favoriteWords";

    constructor () {}

    public getAll (): IFavoriteWords {
        return this.getFavoriteWordsArchive().words;
    }

    public get (word: IWord, type: WordTypeEnum): IFavoriteWord {
        return this.getFavoriteWordsArchive().words.find((favoriteElem) => favoriteElem.word.name === word.name && favoriteElem.type === type);
    }

    public add (word: IWord, type: WordTypeEnum) {
        try {
            let favoritesArchive: IFavoriteWords = this.getFavoriteWordsArchive();
            let isWordExist: boolean = Boolean(favoritesArchive.words.find((favoriteElem) => favoriteElem.word.name === word.name && favoriteElem.type === type));

            if (!isWordExist) {
                favoritesArchive.words.push({
                    word,
                    type
                });
                nsSetString(this.favoriteWordsArchiveKey, JSON.stringify(favoritesArchive));
            } else {
                console.log(`Already favorite - '${word.name}' of type '${type}'`);
            }
        } catch (err) {
            console.log(`Error! ${err.message}`);
        }
    }

    public remove (word: IWord, type: WordTypeEnum) {
        try {
            let favoritesArchive: IFavoriteWords = this.getFavoriteWordsArchive();
            let removedWordIndex: number = favoritesArchive.words.findIndex((favoriteElem) => favoriteElem.word.name === word.name && favoriteElem.type === type);

            if (removedWordIndex >= 0) {
                favoritesArchive.words.splice(removedWordIndex, 1);
                nsSetString(this.favoriteWordsArchiveKey, JSON.stringify(favoritesArchive));
            } else {
                console.log(`Not favorite - '${word.name}' of type '${type}'`);
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