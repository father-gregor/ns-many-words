import { Directive, Input, ElementRef, HostListener, ContentChild, Output, EventEmitter } from "@angular/core";
import { PanGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { View, Color } from "tns-core-modules/ui/core/view";
import { AnimationCurve } from "tns-core-modules/ui/enums";

/**
 * Directives
 */
import { DraggableItemAnchorDirective } from "../draggable-item-anchor/draggable-item-anchor.directive";
import { ReorderContainerDirective } from "../reorder-container/reorder-container.directive";

@Directive({
    selector: "[draggableItem]"
})
export class DraggableItemDirective {
    @Input() public dragItemValue: any;
    @Input() public dragContainer: ReorderContainerDirective;
    @Input() public dragDirection: "horizontal" | "vertical" | "both" = "both";
    @Output("onItemDrop") public onItemDropEmitter: EventEmitter<void> = new EventEmitter<void>();

    @ContentChild(DraggableItemAnchorDirective, { static: false }) public anchor: DraggableItemAnchorDirective;

    private view: View;
    private prevDeltaX: number;
    private prevDeltaY: number;

    constructor (el: ElementRef) {
        this.view = ((el as any).element ? (el as any).element.nativeElement : el.nativeElement) as View;

        this.view.translateX = 0;
        this.view.translateY = 0;
        this.view.scaleX = 1;
        this.view.scaleY = 1;
    }

    @HostListener("pan", ["$event"])
    public draggingListener(event: PanGestureEventData) {
        if (event.state === 1) {
            this.view.style.zIndex = 100;
            this.view.backgroundColor = new Color("#e5e5e5");
        }

        if (event.state !== 3 && this.anchor && !this.anchor.draggingActive) {
            return;
        }

        if (event.state === 1) { // down
            this.prevDeltaX = 0;
            this.prevDeltaY = 0;
        }
        else if (event.state === 2) { // panning
            if (this.dragDirection === "both" || this.dragDirection === "vertical") {
                const lastTranslateY = this.view.translateY;
                this.view.translateY += event.deltaY - this.prevDeltaY;
                this.prevDeltaY = event.deltaY;

                if (this.dragContainer) {
                    const location = this.view.getLocationRelativeTo(this.dragContainer.view);
                    const containerSize = this.dragContainer.view.getActualSize();
                    const itemSize = this.view.getActualSize();
                    if (location.y < 0 || (location.y + itemSize.height) > containerSize.height) {
                        this.view.translateY = lastTranslateY;
                    }
                }
            }

            if (this.dragDirection === "both" || this.dragDirection === "horizontal") {
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
        }
        else if (event.state === 3) { // up
            this.dragContainer.beforeItemDrop(this.dragItemValue);
            this.onItemDropEmitter.emit();
            this.view.animate({
                translate: { x: 0, y: 0 },
                duration: 300,
                curve: AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1)
            }).then(() => {
                this.view.style.zIndex = null;
                this.view.backgroundColor = new Color("#ffffff");
            });
        }
    }
}
