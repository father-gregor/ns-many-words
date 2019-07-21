export type WordType = "daily" | "random" | "meme" | "favorite";

export interface IWord {
    name: string;
    type: WordType;
    nameAsId?: string;
    definitions: string[];
    synonyms?: string[];
    date: {text: string, object: Date};
    newest?: boolean;
    publishDateUTC?: string;
    language?: string;
    archaic?: boolean;
    partOfSpeech?: string[];
    wikiUrl?: string;
}

export interface IWordRouterData {
    word: IWord;
    type: WordType;
}

export interface IWordQueryOptions {
    count?: number;
    checkForNewestWord?: boolean;
}
