import { IWord } from "../word-box/word-box";

export class MasterWordsClass {
    public isLoading: boolean = false;

    constructor() {}

    public getWordDate (word: IWord) {
        return word.date;
        // return this.getFormattedDate(word.date);
    }

    public getFormattedDate (date: string|Date): string {
        let currentDate = new Date();
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);

        let inputDate;
        if (date) {
            if (date instanceof Date) {
                inputDate = date;
            } else {
                inputDate = new Date(date);
            }
            inputDate.setHours(0);
            inputDate.setMinutes(0);
            inputDate.setSeconds(0);
            inputDate.setMilliseconds(0);
        } else {
            return "Mysterious Date";
        }
        let dateDiff = currentDate.getTime() - inputDate.getTime();
        if (currentDate.getTime() == inputDate.getTime()) {
            return "Today";
        } else if (dateDiff <= (24 * 60 * 60 *1000)) {
            return "Yesterday";
        } else { 
            return inputDate.toDateString();
        }
    }
}