import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { IWordTab } from "~/modules/home/tab";

@Injectable()
export class CurrentTabService {
    public tabChanged$: BehaviorSubject<IWordTab>;

    private _currentTab: IWordTab;

    constructor () {
        this.tabChanged$ = new BehaviorSubject<IWordTab>(null);
    }

    public setCurrent (tab: IWordTab) {
        this._currentTab = tab;
        this.tabChanged$.next(this._currentTab);
    }
}
