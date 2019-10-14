import { Component, Input } from "@angular/core";

@Component({
    selector: "ActionBarIconItem",
    moduleId: module.id,
    styleUrls: ["./action-bar-icon-item.scss"],
    templateUrl: "./action-bar-icon-item.html"
})
export class ActionBarIconItemComponent {
    @Input() public iconSrc: string;
    @Input() public isFontIcon: boolean;

    constructor () {}
}
