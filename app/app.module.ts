import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from "~/app-routing.module";

import { FavoriteWordsService } from "~/services/favorite-words/favorite-words.service";
import { WordsService } from "~/services/words/words.service";
import { SnackBarNotificationService } from "~/services/snack-bar-notification/snack-bar-notification.service";
import { PageDataStorageService } from '~/services/page-data-storage/page-data-storage.service';
import { ConnectionMonitorService } from './services/connection-monitor/connection-monitor.service';
import { DeviceInfoInterceptor } from './interceptors/device-info.interceptor';

import { AppComponent } from "~/app.component";
import { HomeComponent } from "~/modules/home/home.component";
import { DailyWordsComponent } from "~/modules/daily-words/daily-words.component";
import { WordBoxComponent } from "~/modules/word-box/word-box.component";
import { RandomWordsComponent } from "~/modules/random-words/random-words.component";
import { MemeWordsComponent } from "~/modules/meme-words/meme-words.component";
import { SettingsComponent } from "~/modules/settings/settings.component";
import { FavoriteWordsComponent } from "~/modules/favorite-words/favorite-words.component";
import { MainActionBarComponent } from "~/modules/main-action-bar/main-action-bar.component";
import { ShowcaseWordComponent } from '~/modules/showcase-word/showcase-word.component';
import { AboutUsComponent } from './modules/about-us/about-us.component';
import { NoConnectionComponent } from './modules/no-connection/no-connection.component';
import { TouchButtonHighlightDirective } from '~/directives/touch-button-highlight/touch-button-highlight.directive';

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
        DailyWordsComponent,
        RandomWordsComponent,
        MemeWordsComponent,
        WordBoxComponent,
        SettingsComponent,
        FavoriteWordsComponent,
        MainActionBarComponent,
        ShowcaseWordComponent,
        AboutUsComponent,
        NoConnectionComponent,
        TouchButtonHighlightDirective
    ],
    providers: [
        WordsService,
        FavoriteWordsService,
        SnackBarNotificationService,
        PageDataStorageService,
        ConnectionMonitorService,
        { 
            provide: HTTP_INTERCEPTORS, 
            useClass: DeviceInfoInterceptor, 
            multi: true 
        }
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
