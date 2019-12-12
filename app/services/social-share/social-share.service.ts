import { Injectable } from "@angular/core";
import * as SocialShare from "nativescript-social-share";

@Injectable()
export class SocialShareService {
    constructor () {}

    public shareWord (word: string, definition: string) {
        this.share(
            `'${word}' - ${definition.toLowerCase()} (shared from 'Many Words')`,
            `Share word "${word}" with others`
        );
    }

    public share (shareText: string, textBeforeShare: string) {
        SocialShare.shareText(
            shareText,
            textBeforeShare
        );
    }
}
