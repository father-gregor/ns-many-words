import { Component, ViewContainerRef } from "@angular/core";
import { BottomSheetService } from "nativescript-material-bottomsheet/angular";

/**
 * Services
 */
import { MainConfigService } from "../../../services/main-config/main-config.service";
import { ContactUsModalComponent } from "~/components/modals/contact-us-modal/contact-us-modal.component";

@Component({
    selector: "SettingsAboutUs",
    styleUrls: ["./settings-about-us-common.scss"],
    templateUrl: "./settings-about-us.html"
})
export class SettingsAboutUsComponent  {
    public appInfoSubtitle: string = "© 2018-2019 Denys Rakov (father_gregor)";

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
