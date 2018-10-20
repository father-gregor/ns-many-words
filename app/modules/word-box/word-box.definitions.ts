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
    date: string;
    language?: string;
    archaic?: boolean;
    partOfSpeech?: string[];
    namedDate?: string;
}

export interface IWordQueryOptions {
    count?: number;
}