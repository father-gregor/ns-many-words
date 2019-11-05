import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "ActionBarIconItem",
    moduleId: module.id,
    styleUrls: ["./action-bar-icon-item-common.scss"],
    templateUrl: "./action-bar-icon-item.html"
})
export class ActionBarIconItemComponent implements OnInit {
    @Input() public iconSrc: string;
    @Input() public isFontIcon: boolean;
    @Input() public backgroundColor?: string;
    @Input() public marginLeft = "5";
    @Input() public marginRight = "5";
    @Input() public imageWidth?: string;
    @Input() public imageHeight?: string;

    constructor () {}

    public ngOnInit () {
        this.imageWidth = this.imageWidth || (this.isFontIcon ? "" : "30");
        this.imageHeight = this.imageHeight || (this.isFontIcon ? "" : "30");
    }
}
