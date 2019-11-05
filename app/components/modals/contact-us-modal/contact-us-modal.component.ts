import { Component } from "@angular/core";
import { BottomSheetParams } from "nativescript-material-bottomsheet/angular";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import * as utils from "tns-core-modules/utils/utils";
import * as email from "nativescript-email";

/**
 * Services
 */
import { MainConfigService } from "../../../services/main-config/main-config.service";

@Component({
    selector: "ContactUsModal",
    styleUrls: ["./contact-us-modal-common.scss"],
    templateUrl: "./contact-us-modal.html"
})
export class ContactUsModalComponent  {
    public availableContactOptions: Array<{title: string, icon: string, cssClass?: string}> = [
        {
            title: "Email",
            icon: String.fromCharCode(0xf0e0),
            cssClass: "email"
        },
        {
            title: "Twitter",
            icon: String.fromCharCode(0xf099),
            cssClass: "twitter"
        },
        {
            title: "Telegram",
            icon: String.fromCharCode(0xf2c6),
            cssClass: "telegram"
        }
    ];

    private emailOptions: email.ComposeOptions;
    private twitterAccountUrl: string;
    private telegramChannelUrl: string;

    constructor (
        public MainConfig: MainConfigService,
        private params: BottomSheetParams
    ) {
        this.emailOptions = {
            subject: this.MainConfig.config.states.settingsAboutUs.contactInfo.viaEmail.subject,
            to: this.MainConfig.config.states.settingsAboutUs.contactInfo.viaEmail.to
        };

        const twitterConfig = this.MainConfig.config.states.settingsAboutUs.contactInfo.viaTwitter;
        this.twitterAccountUrl = twitterConfig.twitterUrl + twitterConfig.accountId;

        const telegramConfig = this.MainConfig.config.states.settingsAboutUs.contactInfo.viaTelegram;
        this.telegramChannelUrl = telegramConfig.telegramUrl + telegramConfig.channelName;

        email.available().then((isAvailable: boolean) => {
            if (!isAvailable) {
                this.availableContactOptions = this.availableContactOptions.filter((o) => o.title !== "Email");
            }
        });
    }

    public onContactTap (args: ItemEventData) {
        const contact = this.availableContactOptions[args.index];
        switch (contact.title) {
            case "Email":
                this.sendEmail();
                break;
            case "Twitter":
                this.openTwitterAccount();
                break;
            case "Telegram":
                this.openTelegramChannel();
                break;
        }
        this.params.closeCallback();
    }

    private async sendEmail () {
        email.compose(this.emailOptions);
    }

    private openTwitterAccount () {
        utils.openUrl(this.twitterAccountUrl);
    }

    private openTelegramChannel () {
        utils.openUrl(this.telegramChannelUrl);
    }
}
