import { Component } from "@angular/core";
import {
    getString as nsGetString,
    setString as nsSetString,
    hasKey as nsHasKey
} from "tns-core-modules/application-settings/application-settings";

import { MainConfigService } from "../../services/main-config/main-config.service";
import { AppThemeService } from "../../services/app-theme/app-theme.service";
import { AppThemeType } from "../../services/app-theme/app-theme.interfaces";

@Component({
    selector: "SettingsGeneral",
    styleUrls: ["./settings-general-common.scss"],
    templateUrl: "./settings-general.html"
})
export class SettingsGeneralComponent  {
    public selectedTheme: AppThemeType;
    public availableThemes = [
        {
            label: "Grey",
            value: "grey"
        },
        {
            label: "Dark",
            value: "dark"
        }
    ];
    private appThemeKey = "appTheme";

    constructor (
        public MainConfig: MainConfigService,
        public AppTheme: AppThemeService
    ) {
        let theme = nsGetString(this.appThemeKey) as AppThemeType;
        if (!theme) {
            theme = "grey";
            nsSetString(this.appThemeKey, theme);
        }
        this.selectedTheme = this.availableThemes.find((t) => t.value === theme).value as AppThemeType;
    }

    public selectedThemeChanged (selectedIndex: number) {
        // this.selectedThemeIndex = selectedIndex;
        // this.changeCurrentTheme(this.availableThemes[this.selectedThemeIndex].toLowerCase() as AppThemeType);
    }

    public changeCurrentTheme (newTheme: AppThemeType) {
        if (this.selectedTheme === newTheme) {
            return;
        }
        this.selectedTheme = newTheme;
        this.AppTheme.changeTheme(this.selectedTheme);
        nsSetString(this.appThemeKey, this.selectedTheme);
    }
}
