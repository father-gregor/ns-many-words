import { Component, AfterViewInit } from "@angular/core";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { device } from "tns-core-modules/platform/platform";
import { isAndroid, isIOS } from "tns-core-modules/ui/page/page";
import { Color } from "tns-core-modules/ui/core/view";
import { android as androidListener, AndroidApplication, on, uncaughtErrorEvent, UnhandledErrorEventData } from "tns-core-modules/application/application";

/**
 * Services
 */
import { GoogleFirebaseService } from "../../services/google-firebase/google-firebase.service";
import { AppThemeService } from "../../services/app-theme/app-theme.service";
import { LoggerService } from "../../services/logger/logger.service";

if (isAndroid && parseInt(device.sdkVersion, 10) >= 21) {
    androidListener.on(AndroidApplication.activityStartedEvent, () => {
        const window = androidListener.startActivity.getWindow();
        window.addFlags((android.view.WindowManager.LayoutParams as any).FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.clearFlags((android.view.WindowManager.LayoutParams as any).FLAG_TRANSLUCENT_STATUS);
        window.setNavigationBarColor(new Color("black").android);
    });
}

@Component({
    selector: "many-words-app",
    moduleId: module.id,
    styleUrls: ["./app-common.scss"],
    templateUrl: "./app.component.html"
})
export class AppComponent implements AfterViewInit  {
    public enableFpsMeter = false;

    constructor (
        private AppTheme: AppThemeService,
        private GoogleFirebase: GoogleFirebaseService,
        private Logger: LoggerService
    ) {
        this.GoogleFirebase.init();

        on(uncaughtErrorEvent, (errData: UnhandledErrorEventData) => {
            this.Logger.error("mw_error_uncaught_exception", {
                message: errData.error.message,
                name: errData.error.name,
                stack: errData.error.stack
            });
        });
    }

    public ngAfterViewInit () {
        setTimeout(() => this.AppTheme.init(), 10);

        if (isIOS) {
            const frame = topmost();
            if (frame) {
                const navigationBar = frame.ios.controller.navigationBar;
                navigationBar.barStyle = UIBarStyle.Black;
            }
        }
    }
}
