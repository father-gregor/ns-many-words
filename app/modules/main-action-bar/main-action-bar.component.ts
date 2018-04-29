import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "ui/dialogs";

import * as mainConfig from "../../config/main.config.json";

@Component({
    selector: "MainActionBar",
    moduleId: module.id,
    templateUrl: "./main-action-bar.html"
})
export class MainActionBarComponent {
    public mainConfig: any = mainConfig;
    @Input() public title: string;

    constructor(public router: Router, public routerExtensions: RouterExtensions) {}

    ngOnInit () {
        this.title = this.title || this.mainConfig.appName;
    }

    public canGoBack () {
        return this.routerExtensions.canGoBack();
    }
    public goBack () {
        console.log(this.router.url);
        this.routerExtensions.backToPreviousPage();
    }

    public openFavorites () {
        this.router.navigate(["/favorites-archive"]);
    }

    public openSettings () {
        
    }

    public showAboutDialog () {
        dialogs.alert((mainConfig as any).aboutDialog);
    }
}
