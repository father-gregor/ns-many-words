import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class PageDataStorageService<T> {
    private _pageData: T;

    constructor (private route: ActivatedRoute) {}

    public get current () {
        return this._pageData;
    }

    public set current (currentData: T) {
        this._pageData = currentData;
    }
}