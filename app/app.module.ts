import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpModule } from "nativescript-angular/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoadingScreenComponent } from "./modules/loading-screen/loading-screen.component";
import { HomeComponent } from "./modules/home/home.component";
import { DailyWordsComponent } from "./modules/daily-words/daily-words.component";
import { WordBoxComponent } from "./modules/word-box/word-box.component";
import { WordsService } from "./services/words/words.service";
import { RandomWordsComponent } from "./modules/random-words/random-words.component";
import { MemeWordsComponent } from "./modules/meme-words/meme-words.component";
import { SettingsComponent } from "./modules/settings/settings.component";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpModule
    ],
    declarations: [
        AppComponent,
        LoadingScreenComponent,
        HomeComponent,
        DailyWordsComponent,
        RandomWordsComponent,
        MemeWordsComponent,
        WordBoxComponent,
        SettingsComponent
    ],
    providers: [
        WordsService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
