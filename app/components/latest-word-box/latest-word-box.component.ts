import { Component, ViewChild, ElementRef, Output, EventEmitter } from "@angular/core";
import {trigger, transition, style, animate} from "@angular/animations";

@Component({
    selector: "LatestWordBox",
    moduleId: module.id,
    styleUrls: [
        "../word-box/word-box-common.scss",
        "../word-box/word-box.scss",
        "./latest-word-box-common.scss"
    ],
    templateUrl: "./latest-word-box.html",
    animations: [
        trigger("wordBoxAnimations", [
            transition(":enter", [
                style({
                    transform: "translateY(100%)",
                    opacity: "0"
                }),
                animate(300, style({
                    transform: "translateY(0%)",
                    opacity: "1.0"
                }))
            ]),
            transition("* => openNewWord", [
                style({
                    transform: "scale(1)",
                    opacity: "1.0"
                }),
                animate(700, style({
                    transform: "scale(0.5)",
                    opacity: "0"
                }))
            ])
        ])
    ]
})
export class LatestWordBox {
    public animationState: "openNewWord" | never;
    public isOpening = false;
    public cardRippleColor = "gold";
    @Output("onLatestWordOpen") public onLatestWordOpenEmitter: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild("wordBox", {static: false}) public element: ElementRef;

    constructor () {}

    public openLatestWord () {
        if (this.isOpening) {
            return;
        }
        this.isOpening = true;
        this.onLatestWordOpenEmitter.emit();

        // this.animationState = "openNewWord";
        // this.cd.detectChanges();
        /* const wordView = this.wordBoxView.nativeElement as View;
        wordView.animate({
            scale: { x: 0.5, y: 0.5},
            opacity: 0,
            duration: 1000
        }).then(() => {
            this.word = {...this.word, latest: false};
            this.cd.detectChanges();
            wordView.translateX = -300;
            wordView.scaleX = 1;
            wordView.scaleY = 1;
            wordView.opacity = 1;
            wordView.animate({
                translate: { x: 0, y: 0 },
                duration: 600,
                curve: AnimationCurve.easeOut
            });
        });*/
    }
}
