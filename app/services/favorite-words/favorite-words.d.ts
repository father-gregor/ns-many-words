import { IWord, WordTypeEnum } from "../../modules/word-box/word-box.definitions";

export interface IFavoriteWord {
    word: IWord;
    type: WordTypeEnum;
}

export interface IFavoriteWords {
    words: IFavoriteWord[];
}