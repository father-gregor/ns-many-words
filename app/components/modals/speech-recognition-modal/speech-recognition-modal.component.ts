import { Component, OnDestroy } from "@angular/core";
import { Subscription, Subject } from "rxjs";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { LottieView } from "nativescript-lottie";

/**
 * Services
 */
import { AppThemeService } from "../../../services/app-theme/app-theme.service";
import { MainConfigService } from "../../../services/main-config/main-config.service";

@Component({
    selector: "SpeechRecognitionModal",
    styleUrls: ["./speech-recognition-modal-common.scss"],
    templateUrl: "./speech-recognition-modal.html"
})
export class SpeechRecognitionModalComponent implements OnDestroy {
    public currentTheme: string;
    public animationSrc: string;

    private closeModalSub: Subscription;

    constructor (
        public MainConfig: MainConfigService,
        private modalParams: ModalDialogParams,
        AppTheme: AppThemeService
    ) {
        this.currentTheme = AppTheme.getCurrent();

        if (this.currentTheme === "ns-light") {
            this.animationSrc = this.MainConfig.config.speechRecognition.activeAnimationLight;
        }
        else {
            this.animationSrc = this.MainConfig.config.speechRecognition.activeAnimationDark;
        }

        this.closeModalSub = (this.modalParams.context.closeModal$ as Subject<any>).subscribe(() => {
            this.modalParams.closeCallback();
        });
    }

    public animationLoaded (event: any) {
        (event.object as LottieView).speed = 1.5;
    }

    public ngOnDestroy () {
        if (this.closeModalSub) {
            this.closeModalSub.unsubscribe();
        }
    }
}
