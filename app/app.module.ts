import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptAnimationsModule } from "nativescript-angular/animations";
import { NativeScriptMaterialCardViewModule } from "nativescript-material-cardview/angular";
import { NativeScriptMaterialRippleModule } from "nativescript-material-ripple/angular";
import { NativeScriptMaterialBottomSheetModule } from "nativescript-material-bottomsheet/angular";

/**
 * Modules
 */
import { AppRoutingModule } from "./app-routing.module";

/**
 * Interceptors
 */
import { DeviceInfoInterceptor } from "./interceptors/device-info.interceptor";

/**
 * Directives
 */
import { TouchButtonHighlightDirective } from "./directives/touch-button-highlight/touch-button-highlight.directive";
import { ReorderContainerDirective } from "./directives/drag-and-drop/reorder-container/reorder-container.directive";
import { DraggableItemDirective } from "./directives/drag-and-drop/draggable-item/draggable-item.directive";
import { DraggableItemAnchorDirective } from "./directives/drag-and-drop/draggable-item-anchor/draggable-item-anchor.directive";

/**
 * Services
 */
import { WordsService } from "./services/words/words.service";
import { MainConfigService } from "./services/main-config/main-config.service";
import { FavoriteWordsService } from "./services/favorite-words/favorite-words.service";
import { SnackBarNotificationService } from "./services/snack-bar-notification/snack-bar-notification.service";
import { PageDataStorageService } from "./services/page-data-storage/page-data-storage.service";
import { ConnectionMonitorService } from "./services/connection-monitor/connection-monitor.service";
import { CurrentTabService } from "./services/current-tab/current-tab.service";
import { GoogleFirebaseService } from "./services/google-firebase/google-firebase.service";
import { LoggerService } from "./services/logger/logger.service";
import { FpsLoggerService } from "./services/fps-logger/fps-logger.service";
import { AppThemeService } from "./services/app-theme/app-theme.service";

/**
 * Components
 */
import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { DailyWordsComponent } from "./components/daily-words/daily-words.component";
import { WordBoxComponent } from "./components/word-box/word-box.component";
import { LatestWordBox } from "./components/latest-word-box/latest-word-box.component";
import { RandomWordsComponent } from "./components/random-words/random-words.component";
import { MemeWordsComponent } from "./components/meme-words/meme-words.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { FavoriteWordsComponent } from "./components/favorite-words/favorite-words.component";
import { MainActionBarComponent } from "./components/action-bars/main-action-bar/main-action-bar.component";
import { ShowcaseWordComponent } from "./components/showcase-word/showcase-word.component";
import { NoConnectionComponent } from "./components/errors/no-connection/no-connection.component";
import { NoWordsComponent } from "./components/errors/no-words/no-words.component";
import { FpsMeterComponent } from "./components/fps-meter/fps-meter.component";
import { SettingsEntryComponent } from "./components/settings/settings-entry/settings-entry.component";
import { SettingsGeneralComponent } from "./components/settings/settings-general/setting-general.component";
import { SettingsAboutUsComponent } from "./components/settings/settings-about-us/settings-about-us.component";
import { SettingsDividerComponent } from "./components/settings/settings-divider/settings-divider.component";
import { ColumnsOrderingModalComponent } from "./components/modals/columns-ordering-modal/columns-ordering-modal.component";
import { ModalContainerComponent } from "./components/modals/modal-container/modal-container.component";
import { SearchWordsComponent } from "./components/search-words/search-words.component";
import { SearchWordsModalComponent } from "./components/modals/search-words-modal/search-words-modal.component";
import { WordDateTimeComponent } from "./components/word-date-time/word-date-time.component";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpClientModule,
        NativeScriptAnimationsModule,
        NativeScriptMaterialCardViewModule,
        NativeScriptMaterialRippleModule,
        NativeScriptMaterialBottomSheetModule.forRoot()
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        DailyWordsComponent,
        RandomWordsComponent,
        MemeWordsComponent,
        WordBoxComponent,
        LatestWordBox,
        SettingsComponent,
        FavoriteWordsComponent,
        MainActionBarComponent,
        ShowcaseWordComponent,
        TouchButtonHighlightDirective,
        NoConnectionComponent,
        NoWordsComponent,
        FpsMeterComponent,
        SettingsEntryComponent,
        SettingsGeneralComponent,
        SettingsAboutUsComponent,
        SettingsDividerComponent,
        ColumnsOrderingModalComponent,
        ReorderContainerDirective,
        DraggableItemDirective,
        DraggableItemAnchorDirective,
        ModalContainerComponent,
        SearchWordsComponent,
        SearchWordsModalComponent,
        WordDateTimeComponent
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
        FpsLoggerService,
        AppThemeService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: DeviceInfoInterceptor,
            multi: true
        }
    ],
    entryComponents: [
        ModalContainerComponent,
        ColumnsOrderingModalComponent,
        SearchWordsModalComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
