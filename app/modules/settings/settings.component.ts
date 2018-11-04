import { Component } from "@angular/core";

import { MainConfigService } from "~/services/main-config/main-config.service.js";

@Component({
    selector: "Settings",
    moduleId: module.id,
    templateUrl: "./settings.html"
})
export class SettingsComponent {
    constructor (public MainConfig: MainConfigService) {}
}
