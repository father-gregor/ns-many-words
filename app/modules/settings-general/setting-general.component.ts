import { Component } from "@angular/core";
import { MainConfigService } from "../../services/main-config/main-config.service";

@Component({
    selector: "SettingsGeneral",
    templateUrl: "./settings-general.html"
})
export class SettingsGeneralComponent  {
    public actionBarTitle: string;

    constructor (public MainConfig: MainConfigService) {
        this.actionBarTitle = this.MainConfig.config.settingsGeneral.title;
    }
}
