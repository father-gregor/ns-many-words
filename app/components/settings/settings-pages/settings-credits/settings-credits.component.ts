import { Component } from "@angular/core";
import {openUrl} from "tns-core-modules/utils/utils";

/**
 * Services
 */
import { MainConfigService } from "../../../../services/main-config/main-config.service";

@Component({
    selector: "SettingsCredits",
    styleUrls: ["./settings-credits-common.scss"],
    templateUrl: "./settings-credits.html"
})
export class SettingsCreditsComponent {
    constructor (
        public MainConfig: MainConfigService
    ) { }

    public openExternalUrl (url) {
        openUrl(url);
    }
}
