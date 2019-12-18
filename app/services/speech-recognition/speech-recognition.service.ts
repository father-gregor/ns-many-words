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
        this.speechRecognition.startListening({
            locale: "en-US",
            returnPartialResults: true,
            onResult: (result: SpeechRecognitionTranscription) => {
                console.log(`User said: ${result.text}`);
                console.log(`User finished?: ${result.finished}`);
                recognition$.next(result);
            },
            onError: (err: string | number) => {
                console.log("onError", err);
                error$.next(err);
            }
        }).catch((err: string | number) => {
            console.log("Catch", err);
            error$.next(err);
        });

        return {recognition$, error$};
    }

    public stopListening () {
        try {
            this.speechRecognition.stopListening();
        }
        catch (err) {}
    }
}
