import { Injectable } from "@angular/core";
import { SnackBar, SnackBarOptions } from "@nstudio/nativescript-snackbar";

@Injectable()
export class SnackBarNotificationService {
    private snackBar: SnackBar = new SnackBar();

    constructor () {}

    public async showMessage (text: string): Promise<any> {
        return await this.snackBar.simple(text);
    }

    public async showUndoAction (text: string) {
        const options: SnackBarOptions = {
            actionText: "UNDO",
            snackText: text,
            hideDelay: 4000
        };

        return await this.snackBar.action(options);
    }
}
