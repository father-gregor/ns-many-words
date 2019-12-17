import { Injectable, ChangeDetectorRef } from "@angular/core";

@Injectable()
export class UtilsService {
    public static safeDetectChanges (cd: ChangeDetectorRef) {
        if (!(cd as any).destroyed) {
            cd.detectChanges();
        }
    }

    constructor () {}
}