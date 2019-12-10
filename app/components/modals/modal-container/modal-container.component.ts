import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "ModalContainer",
    styleUrls: ["./modal-container.scss"],
    templateUrl: "./modal-container.html"
})
export class ModalContainerComponent {
    @Input() public modalTitle: string;
    @Input() public footerButtons: Array<"finish" | "cancel">;
    @Input() public finishButtonTitle = "Finish";
    @Input() public cancelButtonTitle = "Cancel";

    @Output("onFinish") public onFinishEmitter: EventEmitter<void> = new EventEmitter<void>();
    @Output("onCancel") public onCancelEmitter: EventEmitter<void> = new EventEmitter<void>();

    constructor () {}

    public finish () {
        this.onFinishEmitter.emit();
    }

    public cancel () {
        this.onCancelEmitter.emit();
    }
}
