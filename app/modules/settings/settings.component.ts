import { Component } from "@angular/core";

import { MainConfigService } from "~/services/main-config/main-config.service";

@Component({
    selector: "Settings",
    moduleId: module.id,
    templateUrl: "./settings.html"
})
export class SettingsComponent {
    public actionBarTitle: string;

    constructor (public MainConfig: MainConfigService) {
        this.actionBarTitle = this.MainConfig.config.settings.title;
    }
}
