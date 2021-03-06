import { Directive, HostListener, ElementRef, Input, OnInit } from "@angular/core";
import { TouchGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { View, Color } from "tns-core-modules/ui/core/view";

@Directive({
    selector: "[btnHighlight]"
})
export class TouchButtonHighlightDirective implements OnInit {
    @Input("btnDefault") public defaultColor: string;
    @Input("btnHighlight") public highlightColor: string;

    private view: View;

    constructor (private el: ElementRef) {
        this.view = ((el as any).element ? (el as any).element.nativeElement : el.nativeElement) as View;
    }

    public ngOnInit () {
        this.highlightColor = this.highlightColor || "#b4b4b4";
        if (!this.defaultColor) {
            this.defaultColor = this.view.backgroundColor as string;
        }
    }

    @HostListener("touch", ["$event"])
    public touchListener (event: TouchGestureEventData) {
        if (event.action === "down") {
            this.view.backgroundColor = new Color(this.highlightColor);
        }
        else if (event.action === "up" || event.action === "cancel") {
            this.view.backgroundColor = this.defaultColor;
        }
    }
}
