import { Component, ChangeDetectionStrategy } from "@angular/core";

import { MainConfigService } from "~/services/main-config/main-config.service";

@Component({
    selector: "AboutUs",
    moduleId: module.id,
    styleUrls: ["./about-us-common.scss"],
    templateUrl: "./about-us.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutUsComponent {
    public actionBarTitle: string;

    constructor (public MainConfig: MainConfigService) {
        this.actionBarTitle = this.MainConfig.config.settingsAboutUs.title;
    }
}
