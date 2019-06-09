import { Component } from "@angular/core";
import {
    getString as nsGetString,
    setString as nsSetString
} from "tns-core-modules/application-settings/application-settings";
import { action } from "tns-core-modules/ui/dialogs";

import { MainConfigService } from "../../services/main-config/main-config.service";
import { AppThemeService } from "../../services/app-theme/app-theme.service";
import { AppThemeType } from "../../services/app-theme/app-theme.interfaces";

export interface IAppTheme {
    label: string;
    value: AppThemeType;
}

@Component({
    selector: "SettingsGeneral",
    styleUrls: ["./settings-general-common.scss"],
    templateUrl: "./settings-general.html"
})
export class SettingsGeneralComponent  {
    public selectedTheme: IAppTheme;
    public availableThemes: IAppTheme[] = [
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
    private columnsOrderKey = "customColumnsOrder";

    constructor (
        public MainConfig: MainConfigService,
        public AppTheme: AppThemeService
    ) {
        let theme = nsGetString(this.appThemeKey) as AppThemeType;
        if (!theme) {
            theme = "grey";
            nsSetString(this.appThemeKey, theme);
        }
        this.selectedTheme = this.availableThemes.find((t) => t.value === theme);
    }

    public openSelectThemeDialog () {
        const options = {
            title: "Select App Theme",
            message: "",
            cancelButtonText: "Cancel",
            actions: this.availableThemes.map((t) => t.label)
        };

        action(options).then((result) => {
            const newTheme = this.availableThemes.find((t) => t.label === result);
            this.changeCurrentTheme(newTheme);
        });
    }

    public openChangeColumnsOrderDialog () {
        
    }

    private changeCurrentTheme (newTheme: IAppTheme) {
        if (!newTheme || this.selectedTheme.value === newTheme.value) {
            return;
        }
        this.selectedTheme = newTheme;
        this.AppTheme.changeTheme(this.selectedTheme.value);
        nsSetString(this.appThemeKey, this.selectedTheme.value);
    }
}
