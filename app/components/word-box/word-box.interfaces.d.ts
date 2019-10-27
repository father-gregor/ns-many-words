export type WordType = "daily" | "random" | "meme" | "favorite" | "search";

export interface IWord {
    name: string;
    type: WordType;
    nameAsId?: string;
    definitions: string[];
    synonyms?: string[];
    date: {text: string, object: Date};
    latest?: boolean;
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
    checkForLatestWord?: boolean;
}
