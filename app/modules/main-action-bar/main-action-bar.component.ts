import { Component, Input, ChangeDetectorRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationStart, Event } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { ActionBar } from 'tns-core-modules/ui/action-bar/action-bar';
import * as dialogs from "tns-core-modules/ui/dialogs/dialogs";

import * as mainConfig from "../../config/main.config.json";
import { ScrollDirection } from '~/modules/master-words/master-words.interfaces';
import { Animation, AnimationDefinition } from 'tns-core-modules/ui/animation/animation';

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

    private currentMarginTop = 0;
    private currentPos = 0;

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

    public toggleActionBar (diff: number, direction: ScrollDirection) {
        const actionBarHeight = this.actionBarView.getActualSize().height;
        if (direction === 'down') {
            if (Math.abs(this.currentMarginTop) < actionBarHeight) {
                this.currentMarginTop-=5;
                this.actionBarView.style.marginTop = this.currentMarginTop;
            }
        }
        else if (direction === 'up') {
            if (this.currentMarginTop < 0) {
                this.currentMarginTop+=5;
                this.actionBarView.style.marginTop = this.currentMarginTop;
                /*let scrollAnimation: Animation = new Animation([

                ]);*/
            }
        }

        console.log('Margin', this.currentMarginTop);
    }

    public getScrollAnimation (scrollYDiff: number, direction: ScrollDirection) : AnimationDefinition | void {
        const actionBarHeight = this.actionBarView.getActualSize().height;
        if (direction === 'down') {
            let pos = this.currentPos + actionBarHeight / 7;
            if (pos < actionBarHeight) {
                this.currentPos = pos;
                return {
                    target: this.actionBarView,
                    translate: {x: 0, y: -this.currentPos},
                    duration: 500
                };
            }
        }
        else if (direction === 'up') {
            let pos = this.currentPos - actionBarHeight / 7;
            if (pos >= 0) {
                this.currentPos = pos;
                if (pos < (actionBarHeight / 7) * 2) {
                    return {
                        target: this.actionBarView,
                        translate: {x: 0, y: -this.currentPos},
                        duration: 500
                    };
                }
            }
        }
    }

    public animateScroll (direction: ScrollDirection) {
        let barHeight = this.actionBarView.getActualSize().height;;
        if (direction === 'down') {
            if (Math.abs(this.currentPos) < barHeight) {
                this.currentPos = -barHeight;
                this.actionBarView.style.marginTop = -barHeight;
            }
        } else if (direction === 'up') {
            if (this.currentPos < 0) {
                this.currentPos = 0;
                this.actionBarView.style.marginTop = 0; 
            }
        }
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
