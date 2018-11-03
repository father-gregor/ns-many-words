import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import * as mainConfig from "../../config/main.config.json";

@Injectable()
export class WordsService {
    constructor (private http: HttpClient) {}

    public getDailyWord (query: any): Observable<object> {
        return this.getWord((mainConfig as any).wordApi.getDaily, query);
    }

    public getRandomWord (query: any): Observable<object> {
        return this.getWord((mainConfig as any).wordApi.getRandom, query);
    }

    public getMemeWord (query: any): Observable<object> {
        return this.getWord((mainConfig as any).wordApi.getMeme, query);
    }

    private getWord (apiLink: string, optQuery: any = {}, optHeaders: HttpHeaders = this.createRequestHeaders()): Observable<object> {
        const headers = optHeaders;
        const query = optQuery;
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
