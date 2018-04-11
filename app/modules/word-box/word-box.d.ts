export interface IWord {
    name: string;
    definitions: string[];
    date: string;
    language?: string;
    archaic?: boolean;
    partOfSpeech?: string[];
}

export interface IWordQueryOptions {
    count?: number;
}