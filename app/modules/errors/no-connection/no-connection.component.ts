import { Component, Input } from "@angular/core";

/**
 * Interfaces
 */
import ITabError from "../errors.interfaces";

@Component({
    selector: "NoConnection",
    moduleId: module.id,
    styleUrls: ["./no-connection-common.scss"],
    templateUrl: "./no-connection.html"
})
export class NoConnectionComponent implements ITabError {
    @Input() public errorMessage = "Device is offline!";

    constructor () {}
}
