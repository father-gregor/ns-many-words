import { Component } from "@angular/core";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { isIOS } from "tns-core-modules/ui/page/page";

import { GoogleFirebaseService } from "./services/google-firebase/google-firebase.service";

@Component({
    selector: "many-words-app",
    moduleId: module.id,
    templateUrl: "app.component.html"
})
export class AppComponent {
    public enableFpsMeter = false;

    constructor (private GoogleFirebase: GoogleFirebaseService) {
        this.GoogleFirebase.init();

        if (isIOS) {
            const navigationBar = topmost().ios.controller.navigationBar;
            navigationBar.barStyle = UIBarStyle.Black;
        }
    }
}
