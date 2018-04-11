import { Component } from "@angular/core";
import { IWordTab } from "./tab";
import * as dialogs from "ui/dialogs";

import * as mainConfig from "../../config/main.config.json";

@Component({
    selector: "Home",
    moduleId: module.id,
    styleUrls: ["./home-common.css", "./home.css"],
    templateUrl: "./home.component.html"
})
export class HomeComponent {
    public mainConfig: any = mainConfig;

    public dailyWordsTab: IWordTab = {
        title: "Daily Words",
        index: 0
    };
    public randomWordsTab: IWordTab = {
        title: "Random Words",
        index: 1
    };
    public memeWordsTab: IWordTab = {
        title: "Meme Words",
        index: 2
    };

    constructor() {}

    public openSettings () {
        
    }

    public showAboutDialog () {
        dialogs.alert((mainConfig as any).aboutDialog);
    }
}