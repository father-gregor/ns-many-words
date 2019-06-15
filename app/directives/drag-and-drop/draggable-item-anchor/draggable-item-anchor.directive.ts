import { Directive, HostListener } from "@angular/core";
import { PanGestureEventData, TouchGestureEventData } from "tns-core-modules/ui/gestures/gestures";

@Directive({
    selector: "[draggableItemAnchor]"
})
export class DraggableItemAnchorDirective {
    public draggingActive = false;

    constructor () {}

    @HostListener("touch", ["$event"])
    public anchorTouchListener (event: TouchGestureEventData) {
        if (event.action === "down") {
            this.draggingActive = true;
        }
        else if (event.action === "up") {
            this.draggingActive = false;
        }
    }
}
