import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { MainConfigService } from "../main-config/main-config.service";
import { WordType } from "../../components/word-box/word-box.interfaces";

@Injectable()
export class WordsService {
    private initialWords;

    constructor (private http: HttpClient, private MainConfig: MainConfigService) {
        const init = {
            daily: this.getDailyWord({count: 5, checkForNewestWord: true, date: new Date().toString()}),
            random: this.getRandomWord({count: 10}),
            meme: this.getMemeWord({count: 10})
        };

        const dailySub = init.daily.subscribe(() => {
            delete init.daily;
            dailySub.unsubscribe();
        });
        const randomSub = init.random.subscribe(() => {
            delete init.random;
            randomSub.unsubscribe();
        });
        const memeSub = init.meme.subscribe(() => {
            delete init.meme;
            memeSub.unsubscribe();
        });

        this.initialWords = init;
    }

    public getDailyWord (query: any): Observable<object> {
        return this.getWord("daily", query);
    }

    public getRandomWord (query: any): Observable<object> {
        return this.getWord("random", query);
    }

    public getMemeWord (query: any): Observable<object> {
        return this.getWord("meme", query);
    }

    private getWord (apiType: WordType, optQuery: any = {}, optHeaders: HttpHeaders = this.createRequestHeaders()): Observable<object> {
        if (this.initialWords && this.initialWords[apiType]) {
            return this.initialWords[apiType];
        }
        const headers = optHeaders;
        const query = Object.assign({}, optQuery);
        return this.http.get(this.MainConfig.config.wordApi[apiType], {
            params: query,
            headers
        });
    }

    private createRequestHeaders () {
        return new HttpHeaders({
            "Content-Type": "application/json",
        });
    }
}
