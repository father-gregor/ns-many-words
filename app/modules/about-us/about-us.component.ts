import { Component, ChangeDetectionStrategy } from "@angular/core";

import { MainConfigService } from "~/services/main-config/main-config.service.js";

@Component({
    selector: "AboutUs",
    moduleId: module.id,
    styleUrls: ["./about-us-common.css"],
    templateUrl: "./about-us.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutUsComponent {
    public actionBarTitle: string;

    constructor (public MainConfig: MainConfigService) {
        this.actionBarTitle = this.MainConfig.config.aboutUs.title;
    }
}
