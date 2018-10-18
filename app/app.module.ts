import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

import { AppRoutingModule } from "~/app-routing.module";

import { FavoriteWordsService } from "~/services/favorite-words/favorite-words.service";
import { WordsService } from "~/services/words/words.service";
import { SnackBarNotificationService } from "~/services/snack-bar-notification/snack-bar-notification.service";
import { PageDataStorageService } from '~/services/page-data-storage/page-data-storage.service';

import { AppComponent } from "~/app.component";
import { HomeComponent } from "~/modules/home/home.component";
import { MasterWordsComponentCommon } from '~/modules/master-words/master-words.component.common';
import { DailyWordsComponent } from "~/modules/daily-words/daily-words.component";
import { WordBoxComponent } from "~/modules/word-box/word-box.component";
import { RandomWordsComponent } from "~/modules/random-words/random-words.component";
import { MemeWordsComponent } from "~/modules/meme-words/meme-words.component";
import { SettingsComponent } from "~/modules/settings/settings.component";
import { FavoriteWordsComponent } from "~/modules/favorite-words/favorite-words.component";
import { MainActionBarComponent } from "~/modules/main-action-bar/main-action-bar.component";
import { ShowcaseWordComponent } from '~/modules/showcase-word/showcase-word.component';
import { TouchButtonHighlightDirective } from '~/directives/touch-button-highlight/touch-button-highlight.directive';
import { VirtualScrollDirective } from '~/directives/virtual-scroll/virtual-scroll.directive';

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        MasterWordsComponentCommon,
        DailyWordsComponent,
        RandomWordsComponent,
        MemeWordsComponent,
        WordBoxComponent,
        SettingsComponent,
        FavoriteWordsComponent,
        MainActionBarComponent,
        ShowcaseWordComponent,
        TouchButtonHighlightDirective,
        VirtualScrollDirective
    ],
    providers: [
        WordsService,
        FavoriteWordsService,
        SnackBarNotificationService,
        PageDataStorageService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
