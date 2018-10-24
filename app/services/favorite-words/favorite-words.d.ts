import { IWord, WordType } from "~/modules/word-box/word-box.definitions";

export interface IFavoriteWord {
    word: IWord;
    type: WordType;
}

export interface IFavoriteWords {
    words: IFavoriteWord[];
}