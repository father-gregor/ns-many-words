export type WordType = "daily" | "random" | "meme" | "favorite";

export interface IWord {
    name: string;
    nameAsId?: string;
    definitions: string[];
    date: {text: string, object: Date};
    newest?: boolean;
    publishDateUTC?: string;
    language?: string;
    archaic?: boolean;
    partOfSpeech?: string[];
}

export interface IWordRouterData {
    word: IWord;
    type: WordType;
}

export interface IWordQueryOptions {
    count?: number;
    checkForNewestWord?: boolean;
}