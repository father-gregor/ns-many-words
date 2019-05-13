import { Injectable } from "@angular/core";

import { AppThemeType } from "./app-theme.interfaces";
import { Subject } from "rxjs";

@Injectable()
export class AppThemeService {
    public themeChanged$: Subject<string> = new Subject<string>();
    private currentTheme: AppThemeType = "grey";

    constructor () {}

    public getCurrent () {
        return this.currentTheme;
    }

    public changeTheme (newTheme: AppThemeType) {
        this.currentTheme = newTheme;
        this.themeChanged$.next();
    }
}
