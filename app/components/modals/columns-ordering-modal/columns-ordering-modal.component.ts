import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";

@Component({
    selector: "ColumnsOrderingModal",
    styleUrls: ["./columns-ordering-modal-common.scss"],
    templateUrl: "./columns-ordering-modal.html"
})
export class ColumnsOrderingModalComponent {
    public currentColumnsOrder: string[];
    public availableColumns: any;
    public modalTitle: string;

    constructor (private modalParams: ModalDialogParams) {
        this.currentColumnsOrder = this.modalParams.context.currentColumnsOrder;
        this.availableColumns = this.modalParams.context.availableColumns;
        this.modalTitle = this.modalParams.context.modalSettings.title;
    }

    public updateColumnsOrder (newColumnsOrder: string[]) {
        this.currentColumnsOrder = newColumnsOrder;
    }

    public save () {
        this.modalParams.closeCallback(this.currentColumnsOrder);
    }

    public closeModal () {
        this.modalParams.closeCallback();
    }
}
