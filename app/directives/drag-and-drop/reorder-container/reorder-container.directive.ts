import { Directive, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter, ElementRef } from "@angular/core";
import { View } from "tns-core-modules/ui/core/view";

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
    private itemsOrder: Array<{itemValue: any, element: DraggableItemDirective}> = [];

    constructor (el: ElementRef) {
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

    public beforeItemDrop () {
        
    }
}
