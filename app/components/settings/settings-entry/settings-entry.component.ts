import { Component, Input, Output, EventEmitter } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "SettingsEntry",
    styleUrls: ["./settings-entry-common.scss"],
    templateUrl: "./settings-entry.html"
})
export class SettingsEntryComponent {
    @Input() public url: string;
    @Input() public title: string;
    @Input() public subtitle: string;
    @Input() public iconSrc: string;
    @Input() public withFutherActions = true;
    @Input() public useContentProjection = false;
    @Output("onEntryTap") public onEntryTabEmitter: EventEmitter<void> = new EventEmitter<void>();

    constructor (public routerExtensions: RouterExtensions) {}

    public open () {
        if (this.url) {
            this.routerExtensions.navigate([this.url], {
                transition: {
                    name: "slideLeft",
                    duration: 500,
                    curve: "ease"
                }
            });
        }
        else {
            this.onEntryTabEmitter.emit();
        }
    }
}
