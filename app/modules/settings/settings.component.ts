import { Component } from "@angular/core";

import { MainConfigService } from "~/services/main-config/main-config.service";

@Component({
    selector: "Settings",
    moduleId: module.id,
    styleUrls: ["./settings-common.scss"],
    templateUrl: "./settings.html"
})
export class SettingsComponent {
    constructor (public MainConfig: MainConfigService) {}
}
