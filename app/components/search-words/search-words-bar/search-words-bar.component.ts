import { Component, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy } from "@angular/core";
import { TextField } from "tns-core-modules/ui/text-field/text-field";
import { Subscription } from "rxjs";
import { SpeechRecognitionTranscription } from "nativescript-speech-recognition";
import { isAndroid } from "tns-core-modules/platform";

/**
 * Services
 */
import { SpeechRecognitionService } from "../../../services/speech-recognition/speech-recognition.service";
import { isIOS } from "tns-core-modules/ui/page/page";

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

    constructor (
        public SpeechRecognition: SpeechRecognitionService
    ) {}

    public ngOnDestroy () {
        this.stopSpeechRecognition();
    }

    public startSpeechRecognition () {
        const process = this.SpeechRecognition.startListening();
        if (!process) {
            return;
        }

        this.speechRecognitionSub = process.recognition$.subscribe((result: SpeechRecognitionTranscription) => {
            console.log("Recognized", result.text);
            if (result.finished || result.text.length >= 3) {
                this.searchBarFieldView.text = result.text.toLowerCase();
                this.onSearchTextChangeEmitter.emit(result.text);
                this.stopSpeechRecognition();
            }
        });

        this.speechErrorSub = process.error$.subscribe((err: string | number) => {
            if (isAndroid) {
                const nonBreakingErrors = [
                    android.speech.SpeechRecognizer.ERROR_SPEECH_TIMEOUT,
                    android.speech.SpeechRecognizer.ERROR_NO_MATCH,
                    android.speech.SpeechRecognizer.ERROR_RECOGNIZER_BUSY
                ];
                if (!nonBreakingErrors.includes(err as any)) {
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

    private stopSpeechRecognition () {
        if (this.speechRecognitionSub) {
            this.speechRecognitionSub.unsubscribe();
            this.speechRecognitionSub = null;
        }
        if (this.speechErrorSub) {
            this.speechErrorSub.unsubscribe();
            this.speechErrorSub = null;
        }
        this.SpeechRecognition.stopListening();
    }
}
