import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs";
import { map, first } from 'rxjs/operators';


import * as mainConfig from "../../config/main.config.json";

@Injectable()
export class WordsService {
    constructor (private http: Http) {}
    
    public getDailyWord (query: any): Observable<Object> {
        return this.getWord((mainConfig as any).wordApi.getDaily, query);
    }

    public getRandomWord (query: any): Observable<Object> {
        return this.getWord((mainConfig as any).wordApi.getRandom, query);
    }

    public getMemeWord (query: any): Observable<Object> {
        return this.getWord((mainConfig as any).wordApi.getMeme, query);
    }

    private getWord (apiLink: string, optQuery: any = {}, optHeaders: Headers = this.createRequestHeaders()): Observable<Object> {
        let headers = optHeaders;
        let query = optQuery;
        return this.http.get(apiLink, {
            params: query,
            headers: headers
        }).pipe(
            map((res) => res.json()),
            first()
        );
    }

    private createRequestHeaders () {
        return new Headers({
            "Content-Type": "application/json",
        });
    }
}