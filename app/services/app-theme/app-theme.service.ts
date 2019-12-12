import { Injectable } from "@angular/core";
import Theme from "@nativescript/theme";
import { systemAppearance } from "tns-core-modules/application/application";
import {
    getString as nsGetString,
    setString as nsSetString
} from "tns-core-modules/application-settings/application-settings";

import { AppThemeType } from "./app-theme.interfaces";

@Injectable()
export class AppThemeService {
    private appThemeKey = "appTheme";

    constructor () {}

    public init () {
        const currentSystemAppearance = this.getCurrentSystemTheme();
        if (currentSystemAppearance === "dark") {
            Theme.setMode(Theme.Dark);
            this.saveThemeAsDefault("ns-dark");
        }
        else {
            const currentTheme = this.getCurrent();
            const savedTheme = nsGetString(this.appThemeKey) as AppThemeType;
            if (savedTheme) {
                if (currentTheme !== savedTheme) {
                    this.toggleDarkMode();
                }
            }
            else {
                this.saveThemeAsDefault(currentTheme);
            }
        }
    }

    public isDarkModeEnabled () {
        return Theme.getMode() === Theme.Dark;
    }

    public toggleDarkMode () {
        if (Theme.getMode() === Theme.Dark) {
            Theme.setMode(Theme.Light);
        }
        else {
            Theme.setMode(Theme.Dark);
        }
        this.saveThemeAsDefault(this.getCurrent());
    }

    public getCurrentSystemTheme () {
        return systemAppearance();
    }

    public getCurrent () {
        return Theme.getMode();
    }

    private saveThemeAsDefault (currentTheme: string) {
        nsSetString(this.appThemeKey, currentTheme);
    }
}
