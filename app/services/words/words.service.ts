import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";


import * as mainConfig from "../../config/main.config.json";
import { IWord } from "../../modules/word-box/word-box";

@Injectable()
export class WordsService {
    constructor (private http: Http) {}

    public async getRecentWord () {
        return {} as IWord;
    }

    public getRandomWord (): RxObservable<Object> {
        let headers = this.createRequestHeaders();
        return this.http.get((mainConfig as any).wordApi.getRandom, {
            headers: headers
        }).map((res) => res.json());
    }

    private createRequestHeaders () {
        return new Headers({
            "Content-Type": "application/json",
        });
    }
}