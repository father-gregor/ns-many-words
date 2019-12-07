import { Component, AfterViewInit, NgZone } from "@angular/core";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { device } from "tns-core-modules/platform/platform";
import { isAndroid, isIOS } from "tns-core-modules/ui/page/page";
import { Color } from "tns-core-modules/ui/core/view";
import { android as androidListener, AndroidApplication } from "tns-core-modules/application/application";

import { GoogleFirebaseService } from "../../services/google-firebase/google-firebase.service";
import { AppThemeService } from "../../services/app-theme/app-theme.service";
import { RouterExtensions } from "nativescript-angular/router";
import { filter } from "rxjs/operators";
import { NavigationEnd, NavigationStart } from "@angular/router";

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
    private previousUrl: string;

    constructor (
        private AppTheme: AppThemeService,
        private GoogleFirebase: GoogleFirebaseService,
        private routerExtensions: RouterExtensions,
        private zone: NgZone
    ) {
        this.GoogleFirebase.init();
    }

    public ngOnInit () {
        // TODO Temp solution to fix "java.lang.IllegalStateException: The specified child already has a parent." error until BottomNavigation component is fixed
        this.routerExtensions.router.events.pipe(
            filter((event) => event instanceof NavigationStart)
        )
        .subscribe((e: any) => {
            this.previousUrl = this.routerExtensions.router.url;
        });

        androidListener.on(AndroidApplication.activityBackPressedEvent, (args: any) => {
            let canGoBack = false;
            try {
                canGoBack = this.routerExtensions.canGoBack();
            }
            catch (err) {
                canGoBack = false;
            }

            if (canGoBack) {
                args.cancel = true;
                this.zone.run(() => {
                    this.routerExtensions.navigate([this.previousUrl], {
                        transition: {
                            duration: 500,
                            curve: "ease",
                            name: "slideRight"
                        }
                    });
                });
            }
            else {
                args.cancel = false;
            }
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
