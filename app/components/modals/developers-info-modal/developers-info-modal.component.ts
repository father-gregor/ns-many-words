import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";

/**
 * Services
 */
import { AppThemeService } from "../../../services/app-theme/app-theme.service";
import { MainConfigService } from "../../../services/main-config/main-config.service";

@Component({
    selector: "DevelopersInfoModal",
    styleUrls: ["./developers-info-modal-common.scss"],
    templateUrl: "./developers-info-modal.html"
})
export class DevelopersInfoModalComponent {
    public modalTitle = "";
    public currentTheme: string;

    constructor (
        public MainConfig: MainConfigService,
        private modalParams: ModalDialogParams,
        AppTheme: AppThemeService
    ) {
        this.currentTheme = AppTheme.getCurrent();
    }

    public closeModal () {
        this.modalParams.closeCallback();
    }
}
