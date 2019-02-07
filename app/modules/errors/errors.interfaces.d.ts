export type TabErrorType = "noConnection" | "noWords" | "wordsLoadingFailed" | never;

export default interface ITabError {
    errorMessage: string;
} 
