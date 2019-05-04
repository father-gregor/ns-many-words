import { Component, Input } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "SettingsEntry",
    styleUrls: ["./settings-entry-common.scss"],
    templateUrl: "./settings-entry.html"
})
export class SettingsEntryComponent {
    @Input() public url: string;
    @Input() public title: string;
    @Input() public iconSrc: string;

    constructor (public routerExtensions: RouterExtensions) {}

    public openSettingEntry () {
        this.routerExtensions.navigate([this.url], {
            transition: {
                name: "slideLeft",
                duration: 500,
                curve: "ease"
            }
        });
    }
}
