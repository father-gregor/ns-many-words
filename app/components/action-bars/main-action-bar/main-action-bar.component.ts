import { Component, Input, ChangeDetectorRef, ViewChild, OnInit, ElementRef, EventEmitter, Output } from "@angular/core";
import { Router, NavigationStart, Event } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { ActionBar } from "tns-core-modules/ui/action-bar/action-bar";
import * as utils from "tns-core-modules/utils/utils";

import { MainConfigService } from "../../../services/main-config/main-config.service";
import { IWord } from "../../word-box/word-box.interfaces";
import { ActionBarItemsType } from "./main-action-bar.interfaces";
import { SocialShareService } from "../../../services/social-share/social-share.service";

@Component({
    selector: "MainActionBar",
    moduleId: module.id,
    styleUrls: ["./main-action-bar-common.scss", "./main-action-bar.scss"],
    templateUrl: "./main-action-bar.html"
})
export class MainActionBarComponent implements OnInit {
    public isTransitionEnded = true;
    public actionBarView: ActionBar;
    @Input() public routeName: string;
    @Input() public title: string;
    @Input() public actionBarItems: ActionBarItemsType[];
    @Input() public showcaseWord: IWord;
    @Output("onActualHeightSet") public onActualHeightSetEmitter: EventEmitter<number> = new EventEmitter<number>();

    @ViewChild("actionBar", {static: false}) public set actionBarElement (el: any) {
        if (el) {
            this.actionBarView = el.element.nativeElement as ActionBar;
            const intervalId = setInterval(() => {
                const height = this.actionBarView.getActualSize().height;
                if (height > 0) {
                    this.onActualHeightSetEmitter.emit(Math.ceil(height));
                    clearInterval(intervalId);
                }
            }, 100);
        }
    }

    private defaultActionBarItems: ActionBarItemsType[] = ["title", "favoritesArchive", "settings"];

    constructor (
        public MainConfig: MainConfigService,
        public router: Router,
        public routerExtensions: RouterExtensions,
        protected SocialShare: SocialShareService,
        protected cd: ChangeDetectorRef
    ) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                if (event.url === this.routeName) {
                    cd.reattach();
                }
                else {
                    cd.detach();
                }
            }
        });
    }

    public ngOnInit () {
        const stateConfig = this.getStateConfigByUrl(this.routeName) || {};
        this.title = this.title || stateConfig.title || this.MainConfig.config.appName;
        this.actionBarItems = stateConfig.actionBarItems || this.defaultActionBarItems;
    }

    public showFavoritesArchive () {
        return this.router.url.indexOf("favorites-archive") === -1;
    }

    public showWikiLogo () {
        return this.showcaseWord && this.showcaseWord.wikiUrl;
    }

    public canGoBack () {
        return this.routerExtensions.canGoBack();
    }
    public goBack () {
        this.routerExtensions.backToPreviousPage();
    }

    public goHome () {
        this.routerExtensions.navigate(["/home"], {
            clearHistory: true,
            transition: {
                name: "fade",
                duration: 500,
                curve: "ease"
            }
        });
    }

    public openSearchBar () {
        this.routerExtensions.navigate(["/search-words"], {
            transition: {
                name: "slideLeft",
                duration: 500,
                curve: "ease"
            }
        });
    }

    public openFavoritesArchive () {
        this.routerExtensions.navigate(["/favorites-archive"], {
            transition: {
                name: "slideLeft",
                duration: 500,
                curve: "ease"
            }
        });
    }

    public shareWord () {
        this.SocialShare.shareWord(this.showcaseWord.name, this.showcaseWord.definitions[0]);
    }

    public openWordWiki () {
        if (this.showcaseWord.wikiUrl) {
            utils.openUrl(this.showcaseWord.wikiUrl);
        }
    }

    public openSettings () {
        this.routerExtensions.navigate(["/settings"], {
            animated: false
        });
    }

    private getStateConfigByUrl (url: string) {
        for (const stateName of Object.keys(this.MainConfig.config.states)) {
            const configState = this.MainConfig.config.states[stateName];
            if (configState.url && configState.url === url) {
                return configState;
            }
        }
    }
}
