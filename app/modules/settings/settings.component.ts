import { Component } from "@angular/core";

import * as mainConfig from "../../config/main.config.json";

@Component({
    selector: "Settings",
    moduleId: module.id,
    templateUrl: "./settings.html"
})
export class SettingsComponent {
    public mainConfig: any = mainConfig;

    constructor () {}
}
