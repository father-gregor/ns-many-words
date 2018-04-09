import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/operator/first"


import * as mainConfig from "../../config/main.config.json";
import { IWord } from "../../modules/word-box/word-box";

@Injectable()
export class WordsService {
    constructor (private http: Http) {}
    
    public getDailyWord (query: any): RxObservable<Object> {
        return this.getWord((mainConfig as any).wordApi.getDaily, query);
    }

    public getRandomWord (): RxObservable<Object> {
        return this.getWord((mainConfig as any).wordApi.getRandom);
    }

    public getMemeWord (): RxObservable<Object> {
        return this.getWord((mainConfig as any).wordApi.getMeme);
    }

    private getWord (apiLink: string, optQuery: any = {}, optHeaders: Headers = this.createRequestHeaders()): RxObservable<Object> {
        let headers = optHeaders;
        let query = optQuery;
        return this.http.get(apiLink, {
            params: query,
            headers: headers
        }).map((res) => res.json()).first();
    }

    private createRequestHeaders () {
        return new Headers({
            "Content-Type": "application/json",
        });
    }
}