import { Component } from "@angular/core";

import * as mainConfig from "../../config/main.config.json";

@Component({
    selector: "Settings",
    styleUrls: [],
    templateUrl: "./settings.component.html"
})
export class SettingsComponent {
    public mainConfig: any = mainConfig;
    
    constructor() {}
}