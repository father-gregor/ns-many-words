import { Component, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy, ViewContainerRef } from "@angular/core";
import { TextField } from "tns-core-modules/ui/text-field/text-field";
import { Subscription, Subject, BehaviorSubject } from "rxjs";
import { ModalDialogService } from "nativescript-angular/modal-dialog";
import { SpeechRecognitionTranscription } from "nativescript-speech-recognition";
import { isAndroid, isIOS } from "tns-core-modules/platform";

/**
 * Components
 */
import { SpeechRecognitionModalComponent } from "../../modals/speech-recognition-modal/speech-recognition-modal.component";

/**
 * Interfaces
 */
import { SpeechRecognitionStatus } from "../../../services/speech-recognition/speech-recognition";

/**
 * Services
 */
import { SpeechRecognitionService } from "../../../services/speech-recognition/speech-recognition.service";

@Component({
    selector: "SearchWordsBar",
    moduleId: module.id,
    styleUrls: ["./search-words-bar.scss"],
    templateUrl: "./search-words-bar.html"
})
export class SearchWordsBarComponent implements OnDestroy {
    public searchBarFieldView: TextField;
    @Input() public isSearchInProgress = false;
    @Output("onSearchFieldLoaded") public onSearchFieldLoadedEmitter: EventEmitter<TextField> = new EventEmitter<TextField>();
    @Output("onSearchTextChange") public onSearchTextChangeEmitter: EventEmitter<string> = new EventEmitter<string>();
    @Output("onConfirmSearchTap") public onConfirmSearchTapEmitter: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild("searchBarField", {static: false}) public set searchBarFieldElementSetter (el: ElementRef) {
        if (!this.searchBarFieldView) {
           this.searchBarFieldView = el.nativeElement as TextField;
           setTimeout(() => {
                this.searchBarFieldView.focus();
                this.onSearchFieldLoadedEmitter.emit(this.searchBarFieldView);
           }, 10);
        }
    }

    private speechRecognitionSub: Subscription;
    private speechErrorSub: Subscription;
    private recognitionStatusChanged$: Subject<SpeechRecognitionStatus>;
    private closeRecognitionModal$: Subject<any>;

    constructor (
        public SpeechRecognition: SpeechRecognitionService,
        private ModalDialog: ModalDialogService,
        private viewContainer: ViewContainerRef
    ) {}

    public ngOnDestroy () {
        this.stopSpeechRecognition();
    }

    public startSpeechRecognition (openModal: boolean = true) {
        const process = this.SpeechRecognition.startListening();
        if (!process) {
            return;
        }

        process.onStartPromise.then((isStarted: boolean) => {
            if (!isStarted) {
                return;
            }

            if (openModal) {
                this.recognitionStatusChanged$ = new BehaviorSubject<SpeechRecognitionStatus>("active");
                this.closeRecognitionModal$ = new Subject<any>();
                this.ModalDialog.showModal(SpeechRecognitionModalComponent, {
                    viewContainerRef: this.viewContainer,
                    context: {
                        statusChanged$: this.recognitionStatusChanged$,
                        closeModal$: this.closeRecognitionModal$
                    }
                }).then(() => {
                    this.stopSpeechRecognition();
                });
            }
            else if (this.recognitionStatusChanged$) {
                this.recognitionStatusChanged$.next("active");
            }
        });

        this.speechRecognitionSub = process.recognition$.subscribe((result: SpeechRecognitionTranscription) => {
            if (result.finished || result.text.length >= 3) {
                this.searchBarFieldView.text = result.text.toLowerCase();
                this.onSearchTextChangeEmitter.emit(result.text);
                this.stopSpeechRecognition();
            }
        });

        this.speechErrorSub = process.error$.subscribe((err: string | number) => {
            if (isAndroid && typeof err === "number") {
                const nonBreakingErrors = [
                    android.speech.SpeechRecognizer.ERROR_SPEECH_TIMEOUT,
                    android.speech.SpeechRecognizer.ERROR_NO_MATCH,
                    android.speech.SpeechRecognizer.ERROR_RECOGNIZER_BUSY
                ];
                if (nonBreakingErrors.includes(err)) {
                    this.recognitionStatusChanged$.next("lightError");
                    this.restartSpeechRecognition();
                }
                else {
                    this.stopSpeechRecognition();
                }
            }
            if (isIOS) {
                this.stopSpeechRecognition();
            }
        });

        this.dismissKeyboard();
    }

    public onSearchTextChange () {
        this.onSearchTextChangeEmitter.emit(this.searchBarFieldView.text);
    }

    public onConfirmSearchTap () {
        this.onConfirmSearchTapEmitter.emit(this.searchBarFieldView.text);
    }

    public dismissKeyboard () {
        this.searchBarFieldView.dismissSoftInput();
    }

    public clearSearchField () {
        this.searchBarFieldView.text = "";
        this.onSearchTextChangeEmitter.emit(this.searchBarFieldView.text);
        this.searchBarFieldView.focus();
    }

    private restartSpeechRecognition () {
        if (this.speechRecognitionSub) {
            this.speechRecognitionSub.unsubscribe();
            this.speechRecognitionSub = null;
        }
        if (this.speechErrorSub) {
            this.speechErrorSub.unsubscribe();
            this.speechErrorSub = null;
        }

        setTimeout(() => {
            if (this.closeRecognitionModal$) {
                this.SpeechRecognition.stopListening();
                this.startSpeechRecognition(false);
            }
        }, 2000);
    }

    private stopSpeechRecognition () {
        if (this.speechRecognitionSub) {
            this.speechRecognitionSub.unsubscribe();
            this.speechRecognitionSub = null;
        }
        if (this.speechErrorSub) {
            this.speechErrorSub.unsubscribe();
            this.speechErrorSub = null;
        }
        if (this.closeRecognitionModal$) {
            this.closeRecognitionModal$.next();
            this.closeRecognitionModal$ = null;
        }
        if (this.recognitionStatusChanged$) {
            this.recognitionStatusChanged$.unsubscribe();
            this.recognitionStatusChanged$ = null;
        }
        this.SpeechRecognition.stopListening();
    }
}
