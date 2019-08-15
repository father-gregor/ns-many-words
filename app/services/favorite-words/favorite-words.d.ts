import { IWord, WordType } from "../../components/word-box/word-box.interfaces";

export interface IFavoriteWord {
    word: IWord;
    type: WordType;
}

export interface IFavoriteWords {
    words: IFavoriteWord[];
}
