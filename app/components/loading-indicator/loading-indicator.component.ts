import { Component, Input, Output, EventEmitter } from "@angular/core";

/**
 * Services
 */
import { MainConfigService } from "../../services/main-config/main-config.service";
import { AppThemeService } from "../../services/app-theme/app-theme.service";

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
        protected MainConfig: MainConfigService,
        private AppTheme: AppThemeService
    ) {
        this.animationSrc = this.MainConfig.config.loadingAnimations[this.AppTheme.isDarkModeEnabled() ? "defaultDark" : "default"];
    }

    public onIndicatorTap () {
        this.onTapEmitter.emit();
    }
}
