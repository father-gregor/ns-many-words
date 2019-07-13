import { Component } from "@angular/core";
import { action } from "tns-core-modules/ui/dialogs";
import * as utils from "tns-core-modules/utils/utils";
import * as email from "nativescript-email";

/**
 * Services
 */
import { MainConfigService } from "../../../services/main-config/main-config.service";

@Component({
    selector: "SettingsAboutUs",
    styleUrls: ["./settings-about-us-common.scss"],
    templateUrl: "./settings-about-us.html"
})
export class SettingsAboutUsComponent  {
    public appInfoSubtitle: string = "© 2018-2019 Denys Rakov (father_gregor)";
    public contactUsOptions: any[] = [
        { value: "Email" },
        { value: "Telegram" }
    ];

    private emailOptions: email.ComposeOptions;
    private telegramChannelUrl: string;

    constructor (public MainConfig: MainConfigService) {
        this.emailOptions = {
            subject: this.MainConfig.config.states.settingsAboutUs.contactInfo.viaEmail.subject,
            to: this.MainConfig.config.states.settingsAboutUs.contactInfo.viaEmail.to
        };

        const telegramConfig = this.MainConfig.config.states.settingsAboutUs.contactInfo.viaTelegram;
        this.telegramChannelUrl = telegramConfig.telegramUrl + telegramConfig.channelName;

        email.available().then((isAvailable: boolean) => {
            if (!isAvailable) {
                this.contactUsOptions = this.contactUsOptions.filter((o) => o.value !== "Email");
            }
        });
    }

    public async openContactUsDialog () {
        let selectedContactMethod: string;
        const options = {
            title: "Contact via",
            message: "",
            cancelButtonText: "Cancel",
            actions: this.contactUsOptions.map((t) => t.value)
        };

        selectedContactMethod = await action(options);

        switch (selectedContactMethod) {
            case "Email":
                this.sendEmail();
                break;
            case "Telegram":
                this.openTelegramChannel();
                break;
        }
    }

    private async sendEmail () {
        email.compose(this.emailOptions);
    }

    private openTelegramChannel () {
        utils.openUrl(this.telegramChannelUrl);
    }
}
