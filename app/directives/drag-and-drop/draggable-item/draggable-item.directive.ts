import { Directive, Input, ElementRef, HostListener, ContentChild, Output, EventEmitter } from "@angular/core";
import { PanGestureEventData, TouchGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { View, Color } from "tns-core-modules/ui/core/view";
import { AnimationCurve } from "tns-core-modules/ui/enums";

/**
 * Directives
 */
import { DraggableItemAnchorDirective } from "../draggable-item-anchor/draggable-item-anchor.directive";

/**
 * Services
 */
import { AppThemeService } from "../../../services/app-theme/app-theme.service";

@Directive({
    selector: "[draggableItem]"
})
export class DraggableItemDirective {
    @Input() public dragItemValue: any;
    @Input() public dragContainer: any;
    @Input() public dragDirection: "horizontal" | "vertical" | "both" = "both";
    @Output("onItemDrop") public onItemDropEmitter: EventEmitter<void> = new EventEmitter<void>();

    @ContentChild(DraggableItemAnchorDirective, { static: false }) public anchor: DraggableItemAnchorDirective;

    public view: View;
    private prevDeltaX: number;
    private prevDeltaY: number;

    constructor (
        private AppTheme: AppThemeService,
        el: ElementRef
    ) {
        this.view = ((el as any).element ? (el as any).element.nativeElement : el.nativeElement) as View;

        this.view.translateX = 0;
        this.view.translateY = 0;
        this.view.scaleX = 1;
        this.view.scaleY = 1;
    }

    @HostListener("touch", ["$event"])
    public touchListener (event: TouchGestureEventData) {
        if (event.action === "down") {
            if (this.dragContainer) {
                this.dragContainer.onItemPanStart(this.dragItemValue);
            }
            this.prepareViewOnDraggingStart();
        }
        else if (event.action === "up" || event.action === "cancel") {
            if (this.dragContainer) {
                this.dragContainer.onItemPanEnd(this.dragItemValue);
            }
            this.prepareViewOnDraggingEnd();
        }
    }

    @HostListener("pan", ["$event"])
    public draggingListener (event: PanGestureEventData) {
        if (event.state === 2) { // panning
            if (["both", "vertical"].includes(this.dragDirection)) {
                const lastValue = this.view.translateY;
                this.view.translateY += event.deltaY - this.prevDeltaY;
                this.prevDeltaY = event.deltaY;

                if (this.dragContainer) {
                    const location = this.view.getLocationRelativeTo(this.dragContainer.view);
                    const containerSize = this.dragContainer.view.getActualSize();
                    const itemSize = this.view.getActualSize();
                    if (location.y < 0 || (location.y + itemSize.height) > containerSize.height) {
                        this.view.translateY = lastValue;
                    }
                }
            }

            if (["both", "horizontal"].includes(this.dragDirection)) {
                const lastTranslateX = this.view.translateX;
                this.view.translateX += event.deltaX - this.prevDeltaX;
                this.prevDeltaX = event.deltaX;

                if (this.dragContainer) {
                    const location = this.view.getLocationRelativeTo(this.dragContainer.view);
                    const containerSize = this.dragContainer.view.getActualSize();
                    const itemSize = this.view.getActualSize();
                    if (location.x < 0 || (location.x + itemSize.width) > containerSize.width) {
                        this.view.translateX = lastTranslateX;
                    }
                }
            }

            if (this.dragContainer) {
                this.dragContainer.onItemPanInProgress(this.dragItemValue);
            }
        }
    }

    private prepareViewOnDraggingStart () {
        this.prevDeltaX = 0;
        this.prevDeltaY = 0;
        this.view.style.zIndex = 100;

        if (this.AppTheme.getCurrent() === "ns-light") {
            this.view.backgroundColor = new Color(100, 255, 255, 255);
        }
        else {
            this.view.backgroundColor = new Color(100, 0, 0, 0);
        }
    }

    private prepareViewOnDraggingEnd () {
        this.view.backgroundColor = null;
        this.view.style.zIndex = null;
    }
}
