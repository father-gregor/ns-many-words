import { Injectable } from "@angular/core";
import { SpeechRecognition, SpeechRecognitionTranscription } from "nativescript-speech-recognition";
import { Subject } from "rxjs";

@Injectable()
export class SpeechRecognitionService {
    public get isAvailable (): boolean {
        return this.isEngineAvailable;
    }
    private speechRecognition = new SpeechRecognition();
    private isEngineAvailable: boolean;
    private isRecognitionInProgress = false;

    constructor () {
        this.speechRecognition.available().then(
            (isAvailable: boolean) => this.isEngineAvailable = isAvailable,
            () => this.isEngineAvailable = false
        );
    }

    public startListening () {
        if (!this.isEngineAvailable) {
            return;
        }

        const recognition$: Subject<SpeechRecognitionTranscription> = new Subject<SpeechRecognitionTranscription>();
        const error$: Subject<string | number> = new Subject<string | number>();
        const onStartPromise = this.speechRecognition.startListening({
            locale: "en-US",
            returnPartialResults: true,
            onResult: (result: SpeechRecognitionTranscription) => {
                console.log(`User said: ${result.text}; User finished?: ${result.finished}`);
                recognition$.next(result);
            },
            onError: (err: string | number) => {
                console.log("onError", err);
                error$.next(err);
            }
        }).then((isStarted: boolean) => {
            this.isRecognitionInProgress = isStarted;
            return isStarted;
        }).catch((err: string | number) => {
            error$.next(err);
        });

        return {onStartPromise, recognition$, error$};
    }

    public async stopListening () {
        try {
            console.log("Trying to stop", this.isRecognitionInProgress);
            if (this.isRecognitionInProgress) {
                this.isRecognitionInProgress = false;
                await this.speechRecognition.stopListening();
            }
        }
        catch (err) {}
    }
}
