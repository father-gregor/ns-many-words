import { Component, Input, ChangeDetectorRef } from "@angular/core";
import { Router, NavigationEnd, NavigationStart, Event } from "@angular/router";
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
    public isTransitionEnded = true;
    @Input() public routeName: string;
    @Input() public title: string;

    constructor(
        public router: Router, 
        public routerExtensions: RouterExtensions,
        private cd: ChangeDetectorRef
    ) {
        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                if (event.url === this.routeName) {
                    cd.reattach();
                }
                else {
                    cd.detach();
                }
            }
        })
    }

    ngOnInit () {
        this.title = this.title || this.mainConfig.appName;
    }

    public showFavoritesArchive () {
        return this.router.url.indexOf('favorites-archive') === -1;
    }

    public canGoBack () {
        return this.routerExtensions.canGoBack();
    }
    public goBack () {
        this.routerExtensions.backToPreviousPage();
    }

    public openFavorites () {
        this.routerExtensions.navigate(["/favorites-archive"], {
            transition: {
                name: "slideLeft",
                duration: 500,
                curve: "ease"
            }
        });
    }

    public openSettings () {
        
    }

    public showAboutDialog () {
        dialogs.alert((mainConfig as any).aboutDialog);
    }
}
