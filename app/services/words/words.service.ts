import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { device } from "tns-core-modules/platform";
import { Observable } from "rxjs";

import { MainConfigService } from "../main-config/main-config.service";

@Injectable()
export class WordsService {
    constructor (private http: HttpClient, private MainConfig: MainConfigService) {}

    public getDailyWord (query: any): Observable<object> {
        return this.getWord(this.MainConfig.config.wordApi.getDaily, query);
    }

    public getRandomWord (query: any): Observable<object> {
        return this.getWord(this.MainConfig.config.wordApi.getRandom, query);
    }

    public getMemeWord (query: any): Observable<object> {
        return this.getWord(this.MainConfig.config.wordApi.getMeme, query);
    }

    private getWord (apiLink: string, optQuery: any = {}, optHeaders: HttpHeaders = this.createRequestHeaders()): Observable<object> {
        const headers = optHeaders;
        const query = Object.assign({}, optQuery);
        return this.http.get(apiLink, {
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
