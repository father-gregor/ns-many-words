import { Component } from "@angular/core";

/**
 * Services
 */
import { MainConfigService } from "../../services/main-config/main-config.service";

@Component({
    selector: "SettingsAboutUs",
    styleUrls: ["./settings-about-us-common.scss"],
    templateUrl: "./settings-about-us.html"
})
export class SettingsAboutUsComponent  {
    constructor (public MainConfig: MainConfigService) {}
}
