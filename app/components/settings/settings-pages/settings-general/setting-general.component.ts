import { Component, ViewContainerRef } from "@angular/core";
import {
    getString as nsGetString,
    setString as nsSetString
} from "tns-core-modules/application-settings/application-settings";
import { ModalDialogService } from "nativescript-angular/modal-dialog";
import { MainConfigService } from "../../../../services/main-config/main-config.service";
import { ColumnsOrderingModalComponent } from "../../../modals/columns-ordering-modal/columns-ordering-modal.component";
import { AppThemeService } from "../../../../services/app-theme/app-theme.service";

@Component({
    selector: "SettingsGeneral",
    styleUrls: ["./settings-general-common.scss"],
    templateUrl: "./settings-general.html"
})
export class SettingsGeneralComponent {
    public isSystemDarkMode = false;
    public isDarkModeEnabled = false;
    public skipSwitchChange = true;
    public currentColumnsOrder: string[];
    public availableColumns = {
        daily: {
            label: "Daily Words"
        },
        random: {
            label: "Random Words"
        },
        meme: {
            label: "Meme Words"
        }
    };

    private columnsOrderKey = "customColumnsOrder";

    constructor (
        public MainConfig: MainConfigService,
        private AppTheme: AppThemeService,
        private ModalDialog: ModalDialogService,
        private viewContainer: ViewContainerRef
    ) {
        this.isSystemDarkMode = this.AppTheme.getCurrentSystemTheme() === "dark";
        this.isDarkModeEnabled = this.AppTheme.isDarkModeEnabled();
        this.skipSwitchChange = this.isDarkModeEnabled;

        const customColumnsOrder = nsGetString(this.columnsOrderKey) as any;
        if (customColumnsOrder) {
            this.currentColumnsOrder = JSON.parse(customColumnsOrder);
        }
        else {
            this.currentColumnsOrder = this.MainConfig.config.columnsOrder;
        }
    }

    public preventHighlight () {
        return;
    }

    public onDarkModeChange () {
        if (this.skipSwitchChange) {
            this.skipSwitchChange = false;
            return;
        }

        this.AppTheme.toggleDarkMode();
    }

    public openColumnsOrderingModal () {
        this.ModalDialog.showModal(ColumnsOrderingModalComponent, {
            viewContainerRef: this.viewContainer,
            context: {
                currentColumnsOrder: [...this.currentColumnsOrder],
                availableColumns: {...this.availableColumns},
                modalSettings: {
                    title: "Change Columns Order"
                }
            }
        }).then((result: string[]) => {
            if (result && result.length === this.currentColumnsOrder.length) {
                this.currentColumnsOrder = [...result];
                nsSetString(this.columnsOrderKey, JSON.stringify(this.currentColumnsOrder));
            }
        });
    }
}
