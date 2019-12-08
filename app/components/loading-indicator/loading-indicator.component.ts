import { Component, Input, Output, EventEmitter } from "@angular/core";

/**
 * Services
 */
import { MainConfigService } from "../../services/main-config/main-config.service";

@Component({
    selector: "LoadingIndicator",
    templateUrl: "./loading-indicator.html"
})
export class LoadingIndicatorComponent {
    @Input() public animationSrc: string;
    @Input() public width: number;
    @Input() public height: number;
    @Output("onTap") public onTapEmitter: EventEmitter<void> = new EventEmitter<void>();

    constructor (
        protected MainConfig: MainConfigService
    ) {
        this.animationSrc = this.MainConfig.config.loadingAnimations.default;
    }

    public onIndicatorTap () {
        this.onTapEmitter.emit();
    }
}
