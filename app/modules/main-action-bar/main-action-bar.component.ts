import { Component, Input, ChangeDetectorRef, ViewChild, OnInit, AfterViewInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, NavigationStart, Event } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { ActionBar } from "tns-core-modules/ui/action-bar/action-bar";
import * as utils from "tns-core-modules/utils/utils";

import { MainConfigService } from "~/services/main-config/main-config.service";
import { IWord } from "~/modules/word-box/word-box.definitions";

@Component({
    selector: "MainActionBar",
    moduleId: module.id,
    styleUrls: ["./main-action-bar-common.scss", "./main-action-bar.scss"],
    templateUrl: "./main-action-bar.html"
})
export class MainActionBarComponent implements OnInit, AfterViewInit {
    public isTransitionEnded = true;
    public actionBarView: ActionBar;
    @Input() public routeName: string;
    @Input() public title: string;
    @Input() public showcaseWord: IWord;

    @ViewChild("actionBar") public actionBarElement: any;

    constructor (
        public MainConfig: MainConfigService,
        public router: Router,
        public routerExtensions: RouterExtensions,
        protected cd: ChangeDetectorRef,
        private http: HttpClient
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

    public async ngOnInit () {
        this.title = this.title || this.MainConfig.config.appName;

        if (this.showcaseWord) {
            try {
                if (!this.showcaseWord.wikiUrl && this.showcaseWord.wikiUrl !== "") {
                    const wordWikiUrl = this.MainConfig.config.showcaseWord.wikiUrl + this.showcaseWord.name.toLowerCase().replace(/\s/gm, "_");
                    await this.http.get(wordWikiUrl, {responseType: "text"}).toPromise();
                    this.showcaseWord.wikiUrl = wordWikiUrl;
                }
            }
            catch (err) {
                this.showcaseWord.wikiUrl = "";
            }
            finally {
                this.cd.detectChanges();
            }
        }
    }

    public ngAfterViewInit () {
        this.actionBarView = this.actionBarElement.element.nativeElement as ActionBar;
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

    public openFavorites () {
        this.routerExtensions.navigate(["/favorites-archive"], {
            transition: {
                name: "slideLeft",
                duration: 500,
                curve: "ease"
            }
        });
    }

    public openWordWiki () {
        if (this.showcaseWord.wikiUrl) {
            utils.openUrl(this.showcaseWord.wikiUrl);
        }
    }

    public openSettings () {}

    public openAboutUs () {
        this.routerExtensions.navigate(["/about-us"], {
            transition: {
                name: "fade",
                duration: 500,
                curve: "ease"
            }
        });
    }
}
