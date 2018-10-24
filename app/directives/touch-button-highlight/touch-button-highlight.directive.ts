import { Directive, HostListener, ElementRef, Input, OnInit } from '@angular/core';
import { TouchGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { View, Color } from 'tns-core-modules/ui/core/view';

@Directive({
    selector: "[btnHighlight]"
})
export class TouchButtonHighlightDirective implements OnInit {
    @Input("btnHighlight") public highlightColor: string; 

    private view: View
    private defaultColor: Color;

    constructor (private el: ElementRef) {
        this.view = ((el as any).element ? (el as any).element.nativeElement : el.nativeElement) as View;
    }

    ngOnInit () {
        this.highlightColor = this.highlightColor || '#b4b4b4';
        this.defaultColor = this.view.backgroundColor as Color;
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