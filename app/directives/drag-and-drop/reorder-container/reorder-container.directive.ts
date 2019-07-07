import { Directive, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter, ElementRef } from "@angular/core";
import { View } from "tns-core-modules/ui/core/view";
import { AnimationCurve } from "tns-core-modules/ui/enums";

/**
 * Directives
 */
import { DraggableItemDirective } from "../draggable-item/draggable-item.directive";

@Directive({
    selector: "[reorderContainer]"
})
export class ReorderContainerDirective implements AfterContentInit {
    @Output("onItemsOrderChange") public onItemsOrderChangeEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();
    @ContentChildren(DraggableItemDirective) public draggableItems: QueryList<DraggableItemDirective>;

    public view: View;
    private itemsOrder: Array<{itemValue: any, element: DraggableItemDirective, locationX?: number, locationY?: number}> = [];
    private animationInProgress = false;

    constructor (
        el: ElementRef
    ) {
        this.view = ((el as any).element ? (el as any).element.nativeElement : el.nativeElement) as View;
    }

    public ngAfterContentInit () {
        this.draggableItems.forEach((item) => {
            item.dragContainer = this;
            this.itemsOrder.push({
                itemValue: item.dragItemValue,
                element: item
            });
        });
    }

    public onItemPanStart (itemValue: any) {
        this.itemsOrder.forEach((item) => {
            item.locationX = item.element.view.getLocationRelativeTo(this.view).x;
            item.locationY = item.element.view.getLocationRelativeTo(this.view).y;
        });
    }

    public onItemPanInProgress (itemValue: any) {
        if (this.animationInProgress) {
            return;
        }
        const itemInd = this.itemsOrder.findIndex((i) => i.itemValue === itemValue);
        const prevItemInd = (itemInd - 1) >= 0 ? (itemInd - 1) : null;
        const nextItemInd = (itemInd + 1) < this.itemsOrder.length ? (itemInd + 1) : null;

        const itemView = this.itemsOrder[itemInd].element.view;
        const itemLocation = itemView.getLocationRelativeTo(this.view);

        let isOrderChanged = false;
        if (prevItemInd != null) {
            const prevItem = this.itemsOrder[prevItemInd];
            const prevItemTranslateY = this.itemsOrder[prevItemInd].element.view.translateY;

            if ((itemLocation.y - itemView.getActualSize().height / 2) <= prevItem.locationY) {
                [this.itemsOrder[prevItemInd].locationX, this.itemsOrder[itemInd].locationX] = [this.itemsOrder[itemInd].locationX, this.itemsOrder[prevItemInd].locationX];
                [this.itemsOrder[prevItemInd].locationY, this.itemsOrder[itemInd].locationY] = [this.itemsOrder[itemInd].locationY, this.itemsOrder[prevItemInd].locationY];
                [this.itemsOrder[itemInd], this.itemsOrder[prevItemInd]] = [this.itemsOrder[prevItemInd], this.itemsOrder[itemInd]];
                this.animationInProgress = true;
                prevItem.element.view.animate({
                    translate: {
                        x: 0,
                        y: prevItemTranslateY === 0 ? (this.itemsOrder[itemInd].locationY - this.itemsOrder[prevItemInd].locationY) : 0
                    },
                    duration: 200,
                    curve: AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1)
                }).then(() => {
                    this.animationInProgress = false;
                });
                isOrderChanged = true;
            }
        }
        if (!isOrderChanged && nextItemInd != null) {
            const nextItem = this.itemsOrder[nextItemInd];
            const nextItemTranslateY = this.itemsOrder[nextItemInd].element.view.translateY;

            if ((itemLocation.y + itemView.getActualSize().height / 2) >= nextItem.locationY) {
                [this.itemsOrder[nextItemInd].locationX, this.itemsOrder[itemInd].locationX] = [this.itemsOrder[itemInd].locationX, this.itemsOrder[nextItemInd].locationX];
                [this.itemsOrder[nextItemInd].locationY, this.itemsOrder[itemInd].locationY] = [this.itemsOrder[itemInd].locationY, this.itemsOrder[nextItemInd].locationY];
                [this.itemsOrder[itemInd], this.itemsOrder[nextItemInd]] = [this.itemsOrder[nextItemInd], this.itemsOrder[itemInd]];
                this.animationInProgress = true;
                nextItem.element.view.animate({
                    translate: {
                        x: 0,
                        y: nextItemTranslateY === 0 ? (this.itemsOrder[itemInd].locationY - this.itemsOrder[nextItemInd].locationY) : 0
                    },
                    duration: 200,
                    curve: AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1)
                }).then(() => {
                    this.animationInProgress = false;
                });
            }
        }
    }

    public onItemPanEnd (itemValue: any) {
        this.onItemsOrderChangeEmitter.emit(this.itemsOrder.map((i) => {
            if (i.itemValue !== itemValue) {
                i.element.view.translateX = 0;
                i.element.view.translateY = 0;
            }
            return i.itemValue;
        }));
    }
}
