import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";

@Component({
    selector: "ColumnsOrderingModal",
    templateUrl: "./columns-ordering-modal.html"
})
export class ColumnsOrderingModalComponent {
    constructor (private modalParams: ModalDialogParams) {}
}
