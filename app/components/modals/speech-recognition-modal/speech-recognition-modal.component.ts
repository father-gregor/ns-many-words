import { Component, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Subscription, Subject, BehaviorSubject } from "rxjs";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { LottieView } from "nativescript-lottie";

/**
 * Interfaces
 */
import { SpeechRecognitionStatus } from "~/services/speech-recognition/speech-recognition";

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
    public currentStatus: SpeechRecognitionStatus;
    public currentTheme: string;
    public animationSrc: string;

    private microphoneAnimationView: LottieView;
    private subs: Subscription;

    constructor (
        public MainConfig: MainConfigService,
        private modalParams: ModalDialogParams,
        private cd: ChangeDetectorRef,
        AppTheme: AppThemeService
    ) {
        this.currentTheme = AppTheme.getCurrent();

        if (this.currentTheme === "ns-light") {
            this.animationSrc = this.MainConfig.config.speechRecognition.activeAnimationLight;
        }
        else {
            this.animationSrc = this.MainConfig.config.speechRecognition.activeAnimationDark;
        }

        this.subs = new Subscription();

        this.subs.add(
            (this.modalParams.context.statusChanged$ as BehaviorSubject<SpeechRecognitionStatus>).subscribe((status: SpeechRecognitionStatus) => {
                this.currentStatus = status;

                if (this.microphoneAnimationView) {
                    if (this.currentStatus === "active" && !this.microphoneAnimationView.isAnimating()) {
                        this.microphoneAnimationView.playAnimation();
                    }
                    if (this.currentStatus === "lightError") {
                        this.microphoneAnimationView.cancelAnimation();
                        this.microphoneAnimationView.progress = 1;
                    }
                    this.cd.detectChanges();
                }
            })
        );

        this.subs.add(
            (this.modalParams.context.closeModal$ as Subject<any>).subscribe(() => {
                this.modalParams.closeCallback();
            })
        );
    }

    public animationLoaded (event: any) {
        this.microphoneAnimationView = event.object as LottieView;
        this.microphoneAnimationView.speed = 1.5;
    }

    public ngOnDestroy () {
        if (this.subs) {
            this.subs.unsubscribe();
        }
    }
}
