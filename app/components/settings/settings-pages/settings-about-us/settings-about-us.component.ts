import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService } from "nativescript-angular/modal-dialog";
import { RouterExtensions } from "nativescript-angular/router";
import { BottomSheetService } from "nativescript-material-bottomsheet/angular";

/**
 * Services
 */
import { MainConfigService } from "../../../../services/main-config/main-config.service";
import { ContactUsBottomsheetComponent } from "../../../bottomsheets/contact-us-bottomsheet/contact-us-bottomsheet.component";
import { DevelopersInfoModalComponent } from "../../../modals/developers-info-modal/developers-info-modal.component";

@Component({
    selector: "SettingsAboutUs",
    styleUrls: ["./settings-about-us-common.scss"],
    templateUrl: "./settings-about-us.html"
})
export class SettingsAboutUsComponent  {
    constructor (
        public MainConfig: MainConfigService,
        public BottomSheet: BottomSheetService,
        private ModalDialog: ModalDialogService,
        private routerExtensions: RouterExtensions,
        private viewContainer: ViewContainerRef
    ) {}

    public openDevelopersInfoModal () {
        this.ModalDialog.showModal(DevelopersInfoModalComponent, {
            viewContainerRef: this.viewContainer,
            context: {}
        });
    }

    public openCreditsPage () {
        this.routerExtensions.navigate(["/settings-entry/about-us/credits"], {
            animated: false
        });
    }

    public async openContactUsBottomsheet () {
        this.BottomSheet.show(ContactUsBottomsheetComponent, {
            viewContainerRef: this.viewContainer,
            context: {}
        });
    }
}
