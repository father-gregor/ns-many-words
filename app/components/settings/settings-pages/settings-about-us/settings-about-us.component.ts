import { Component, ViewContainerRef } from "@angular/core";
import { BottomSheetService } from "nativescript-material-bottomsheet/angular";

/**
 * Services
 */
import { MainConfigService } from "../../../../services/main-config/main-config.service";
import { ContactUsModalComponent } from "../../../modals/contact-us-modal/contact-us-modal.component";

@Component({
    selector: "SettingsAboutUs",
    styleUrls: ["./settings-about-us-common.scss"],
    templateUrl: "./settings-about-us.html"
})
export class SettingsAboutUsComponent  {
    constructor (
        public MainConfig: MainConfigService,
        public BottomSheet: BottomSheetService,
        private viewContainer: ViewContainerRef
    ) {}

    public async openContactUsBottomSheet () {
        this.BottomSheet.show(ContactUsModalComponent, {
            viewContainerRef: this.viewContainer,
            context: {}
        });
    }
}
