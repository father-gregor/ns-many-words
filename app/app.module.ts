import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoadingScreenComponent } from "./modules/loading-screen/loading-screen.component";
import { HomeComponent } from "./modules/home/home.component";
import { RecentWordsComponent } from "./modules/recent-words/recent-words.component";
import { WordBoxComponent } from "./modules/word-box/word-box.component";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        LoadingScreenComponent,
        HomeComponent,
        RecentWordsComponent,
        WordBoxComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
