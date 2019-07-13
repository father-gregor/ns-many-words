import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { IWordTab } from "~/components/home/tab";

@Injectable()
export class CurrentTabService {
    public tabChanged$: BehaviorSubject<IWordTab>;

    private _currentTab: IWordTab;
    private _currentTabIndex: number;

    constructor () {
        this.tabChanged$ = new BehaviorSubject<IWordTab>(null);
    }

    public setCurrent (tab: IWordTab, index: number) {
        this._currentTab = tab;
        this._currentTabIndex = index;
        this.tabChanged$.next(this._currentTab);
    }

    public getCurrent () {
        return this._currentTab;
    }

    public getCurrentIndex () {
        return this._currentTabIndex;
    }
}
