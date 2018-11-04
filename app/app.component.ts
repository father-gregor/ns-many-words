import { Component } from "@angular/core";

import { GoogleFirebaseService } from "./services/google-firebase/google-firebase.service.js";

@Component({
    selector: "many-words-app",
    moduleId: module.id,
    templateUrl: "app.component.html"
})
export class AppComponent {
    constructor (private GoogleFirebase: GoogleFirebaseService) {
        this.GoogleFirebase.init();
    }
}
