export enum WordTypeEnum {
    daily = "daily",
    random = "random",
    meme = "meme",
    favorite = "favorite"
}

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

export interface IWordQueryOptions {
    count?: number;
    checkForNewestWord?: boolean;
}