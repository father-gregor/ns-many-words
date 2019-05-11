import { Component } from "@angular/core";
import { MainConfigService } from "../../services/main-config/main-config.service";

@Component({
    selector: "SettingsGeneral",
    templateUrl: "./settings-general.html"
})
export class SettingsGeneralComponent  {
    constructor (public MainConfig: MainConfigService) {}
}
