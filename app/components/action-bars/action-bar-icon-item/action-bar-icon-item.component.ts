import { Component, Input, OnInit } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
    selector: "ActionBarIconItem",
    moduleId: module.id,
    styleUrls: ["./action-bar-icon-item-common.scss"],
    templateUrl: "./action-bar-icon-item.html",
    animations: [
        trigger("actionBarItemEnter", [
            transition("void => fadeIn", [
                style({opacity: 0}),
                animate("300ms ease-in")
            ])
        ])
    ]
})
export class ActionBarIconItemComponent implements OnInit {
    public animationState: "fadeIn" | null;
    @Input() public iconSrc: string;
    @Input() public isFontIcon: boolean;
    @Input() public enableAnimations = false;
    @Input() public backgroundColor?: string;
    @Input() public marginLeft = "5";
    @Input() public marginRight = "5";
    @Input() public imageWidth?: string;
    @Input() public imageHeight?: string;

    constructor () {}

    public ngOnInit () {
        this.imageWidth = this.imageWidth || (this.isFontIcon ? "" : "30");
        this.imageHeight = this.imageHeight || (this.isFontIcon ? "" : "30");
        if (this.enableAnimations) {
            this.animationState = "fadeIn";
        }
    }
}
