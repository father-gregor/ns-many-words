import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

/**
 * Modules
 */
import { AppRoutingModule } from "~/app-routing.module";

/**
 * Interceptors
 */
import { DeviceInfoInterceptor } from "./interceptors/device-info.interceptor";

/**
 * Directives
 */
import { TouchButtonHighlightDirective } from "~/directives/touch-button-highlight/touch-button-highlight.directive";

/**
 * Services
 */
import { WordsService } from "~/services/words/words.service";
import { MainConfigService } from "./services/main-config/main-config.service";
import { FavoriteWordsService } from "~/services/favorite-words/favorite-words.service";
import { SnackBarNotificationService } from "~/services/snack-bar-notification/snack-bar-notification.service";
import { PageDataStorageService } from "~/services/page-data-storage/page-data-storage.service";
import { ConnectionMonitorService } from "./services/connection-monitor/connection-monitor.service";
import { CurrentTabService } from "./services/current-tab/current-tab.service";
import { GoogleFirebaseService } from "./services/google-firebase/google-firebase.service";
import { LoggerService } from "./services/logger/logger.service";

/**
 * Components
 */
import { AppComponent } from "~/app.component";
import { HomeComponent } from "~/modules/home/home.component";
import { DailyWordsComponent } from "~/modules/daily-words/daily-words.component";
import { WordBoxComponent } from "~/modules/word-box/word-box.component";
import { RandomWordsComponent } from "~/modules/random-words/random-words.component";
import { MemeWordsComponent } from "~/modules/meme-words/meme-words.component";
import { SettingsComponent } from "~/modules/settings/settings.component";
import { FavoriteWordsComponent } from "~/modules/favorite-words/favorite-words.component";
import { MainActionBarComponent } from "~/modules/main-action-bar/main-action-bar.component";
import { ShowcaseWordComponent } from "~/modules/showcase-word/showcase-word.component";
import { AboutUsComponent } from "./modules/about-us/about-us.component";
import { NoConnectionComponent } from "./modules/errors/no-connection/no-connection.component";
import { NoWordsComponent } from "./modules/errors/no-words/no-words.component";
import { WordsLoadingFailedComponent } from "./modules/errors/words-loading-failed/words-loading-failed.component";

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
        TouchButtonHighlightDirective,
        NoConnectionComponent,
        NoWordsComponent,
        WordsLoadingFailedComponent
    ],
    providers: [
        WordsService,
        MainConfigService,
        FavoriteWordsService,
        SnackBarNotificationService,
        PageDataStorageService,
        ConnectionMonitorService,
        CurrentTabService,
        GoogleFirebaseService,
        LoggerService,
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
