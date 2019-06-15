import { Component, ViewContainerRef } from "@angular/core";
import {
    getString as nsGetString,
    setString as nsSetString
} from "tns-core-modules/application-settings/application-settings";
import { action } from "tns-core-modules/ui/dialogs";
import { ModalDialogOptions, ModalDialogService } from "nativescript-angular/modal-dialog";

import { MainConfigService } from "../../../services/main-config/main-config.service";
import { AppThemeService } from "../../../services/app-theme/app-theme.service";
import { AppThemeType } from "../../../services/app-theme/app-theme.interfaces";
import { ColumnsOrderingModalComponent } from "~/components/modals/columns-ordering-modal/columns-ordering-modal.component";

export interface IAppTheme {
    label: string;
    value: AppThemeType;
}

@Component({
    selector: "SettingsGeneral",
    styleUrls: ["./settings-general-common.scss"],
    templateUrl: "./settings-general.html"
})
export class SettingsGeneralComponent  {
    public selectedTheme: IAppTheme;
    public availableThemes: IAppTheme[] = [
        {
            label: "Grey",
            value: "grey"
        },
        {
            label: "Dark",
            value: "dark"
        }
    ];
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

    private appThemeKey = "appTheme";
    private columnsOrderKey = "customColumnsOrder";

    constructor (
        public MainConfig: MainConfigService,
        public AppTheme: AppThemeService,
        private ModalDialog: ModalDialogService,
        private viewContainer: ViewContainerRef
    ) {
        let theme = nsGetString(this.appThemeKey) as AppThemeType;
        if (!theme) {
            theme = "grey";
            nsSetString(this.appThemeKey, theme);
        }
        this.selectedTheme = this.availableThemes.find((t) => t.value === theme);

        const customColumnsOrder = nsGetString(this.columnsOrderKey) as any;
        if (customColumnsOrder) {
            this.currentColumnsOrder = JSON.parse(customColumnsOrder);
        }
        else {
            this.currentColumnsOrder = this.MainConfig.config.columnsOrder;
        }
    }

    public openSelectThemeDialog () {
        const options = {
            title: "Select App Theme",
            message: "",
            cancelButtonText: "Cancel",
            actions: this.availableThemes.map((t) => t.label)
        };

        action(options).then((result) => {
            const newTheme = this.availableThemes.find((t) => t.label === result);
            this.changeCurrentTheme(newTheme);
        });
    }

    public openColumnsOrderingModal () {
        this.ModalDialog.showModal(ColumnsOrderingModalComponent, {
            viewContainerRef: this.viewContainer,
            context: {
                currentColumnsOrder: [...this.currentColumnsOrder],
                availableColumns: {...this.availableColumns},
                modalSettings: {
                    title: "Change Sections Order"
                }
            }
        }).then((result: string[]) => {
            if (result && result.length === this.currentColumnsOrder.length) {
                console.log("Order Updated", result);
            }
        });
    }

    private changeCurrentTheme (newTheme: IAppTheme) {
        if (!newTheme || this.selectedTheme.value === newTheme.value) {
            return;
        }
        this.selectedTheme = newTheme;
        this.AppTheme.changeTheme(this.selectedTheme.value);
        nsSetString(this.appThemeKey, this.selectedTheme.value);
    }
}
