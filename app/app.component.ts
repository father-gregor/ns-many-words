import { Component, AfterViewInit } from "@angular/core";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { isIOS } from "tns-core-modules/ui/page/page";

import { GoogleFirebaseService } from "./services/google-firebase/google-firebase.service";
import { AppThemeService } from "./services/app-theme/app-theme.service";

@Component({
    selector: "many-words-app",
    moduleId: module.id,
    templateUrl: "app.component.html"
})
export class AppComponent implements AfterViewInit  {
    public enableFpsMeter = false;
    public currentAppTheme: string;

    constructor (
        private AppTheme: AppThemeService,
        private GoogleFirebase: GoogleFirebaseService
    ) {
        this.currentAppTheme = `${this.AppTheme.getCurrent()}-theme`;
        this.AppTheme.themeChanged$.subscribe(() => {
            this.currentAppTheme = `${this.AppTheme.getCurrent()}-theme`;
        });

        this.GoogleFirebase.init();
    }

    public ngAfterViewInit () {
        if (isIOS) {
            const frame = topmost();
            if (frame) {
                const navigationBar = topmost().ios.controller.navigationBar;
                navigationBar.barStyle = UIBarStyle.Black;
            }
            else {
                console.log("FRAME STILL NOT LOADED");
            }
        }
    }
}
