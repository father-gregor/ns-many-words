import { Component, AfterViewInit } from "@angular/core";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { device } from "tns-core-modules/platform/platform";
import { isAndroid, isIOS } from "tns-core-modules/ui/page/page";
import { Color } from "tns-core-modules/ui/core/view";
import { android as androidObj, AndroidApplication } from "tns-core-modules/application/application";

import { GoogleFirebaseService } from "./services/google-firebase/google-firebase.service";
import { AppThemeService } from "./services/app-theme/app-theme.service";

if (isAndroid && parseInt(device.sdkVersion, 10) >= 21) {
    androidObj.on(AndroidApplication.activityStartedEvent, () => {
        const window = androidObj.startActivity.getWindow();
        window.addFlags((android.view.WindowManager.LayoutParams as any).FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.clearFlags((android.view.WindowManager.LayoutParams as any).FLAG_TRANSLUCENT_STATUS);
        window.setNavigationBarColor(new Color("black").android);
    });
}

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
                const navigationBar = frame.ios.controller.navigationBar;
                navigationBar.barStyle = UIBarStyle.Black;
            }
            else {
                console.log("FRAME STILL NOT LOADED");
            }
        }
    }
}
