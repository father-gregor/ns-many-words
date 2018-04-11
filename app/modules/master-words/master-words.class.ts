import { ScrollEventData, ScrollView } from "tns-core-modules/ui/scroll-view/scroll-view";

import { IWord, IWordQueryOptions } from "../word-box/word-box";

export class MasterWordsClass {
    protected scrollView: ScrollView;
    public noWordsMsg: string;
    public showNoWordsMsg: boolean = false;
    public isLoading: boolean = false;

    constructor() {}

    public onScroll (data: ScrollEventData) {
        if (this.scrollView.scrollableHeight === data.scrollY) {
            this.loadNewWords();
        }
    }

    public loadNewWords (options: IWordQueryOptions = {}) {
        throw new Error ("No overiding method in the nested class!");
    }

    public getWordDate (word: IWord) {
        let currentDate = new Date();
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);

        let inputDate;
        if (word.date) {
            inputDate = new Date(word.date)
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
        }
        return inputDate.toLocaleDateString();
    }
}