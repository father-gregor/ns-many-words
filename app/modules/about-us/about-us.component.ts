import { Component, ChangeDetectionStrategy } from "@angular/core";

import * as mainConfig from "../../config/main.config.json";

@Component({
    selector: "AboutUs",
    moduleId: module.id,
    styleUrls: ["./about-us-common.css"],
    templateUrl: "./about-us.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutUsComponent {
    public mainConfig: any = mainConfig;
    public actionBarTitle: string = (mainConfig as any).aboutUs.title;

    constructor () {}
}
