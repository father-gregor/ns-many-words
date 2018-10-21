import { Component, Input, ChangeDetectorRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationStart, Event } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { ActionBar } from 'tns-core-modules/ui/action-bar/action-bar';

import * as mainConfig from "../../config/main.config.json";

@Component({
    selector: "MainActionBar",
    moduleId: module.id,
    styleUrls: ["./main-action-bar-common.css", "./main-action-bar.css"],
    templateUrl: "./main-action-bar.html"
})
export class MainActionBarComponent implements OnInit, AfterViewInit {
    public mainConfig: any = mainConfig;
    public isTransitionEnded = true;
    public actionBarView: ActionBar;
    @Input() public routeName: string;
    @Input() public title: string;

    @ViewChild('actionBar') public actionBarElement: any;

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

    ngAfterViewInit () {
        this.actionBarView = this.actionBarElement.element.nativeElement as ActionBar;
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

    public openAboutUs () {
        this.routerExtensions.navigate(["/about-us"], {
            transition: {
                name: "slideLeft",
                duration: 500,
                curve: "ease"
            }
        });
    }
}
