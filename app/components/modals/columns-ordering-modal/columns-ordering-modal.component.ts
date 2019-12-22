import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";

/**
 * Services
 */
import { AppThemeService } from "../../../services/app-theme/app-theme.service";

@Component({
    selector: "ColumnsOrderingModal",
    styleUrls: ["./columns-ordering-modal-common.scss"],
    templateUrl: "./columns-ordering-modal.html"
})
export class ColumnsOrderingModalComponent {
    public currentColumnsOrder: string[];
    public availableColumns: any;
    public modalTitle = "Change Columns Order";
    public currentTheme: string;

    constructor (
        private modalParams: ModalDialogParams,
        AppTheme: AppThemeService
    ) {
        this.currentTheme = AppTheme.getCurrent();

        this.currentColumnsOrder = this.modalParams.context.currentColumnsOrder;
        this.availableColumns = this.modalParams.context.availableColumns;
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
