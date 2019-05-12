import { Injectable } from "@angular/core";

import { AppThemeType } from "./app-theme.interfaces";

@Injectable()
export class AppThemeService {
    private currentTheme: AppThemeType = "default";

    constructor () {}

    public changeTheme (newTheme: AppThemeType) {
        this.currentTheme = newTheme;
    }
}
