import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { HomeComponent } from "~/modules/home/home.component";
import { FavoriteWordsComponent } from "~/modules/favorite-words/favorite-words.component";
import { ShowcaseWordComponent } from "~/modules/showcase-word/showcase-word.component";
import { SettingsComponent } from "./modules/settings/settings.component";
import { SettingsGeneralComponent } from "./modules/settings-general/setting-general.component";
import { SettingsAboutUsComponent } from "./modules/settings-about-us/settings-about-us.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "favorites-archive", component: FavoriteWordsComponent },
    { path: "showcase-word", component: ShowcaseWordComponent },
    { path: "settings", component: SettingsComponent },
    { path: "settings-entry/general", component: SettingsGeneralComponent },
    { path: "settings-entry/about-us", component: SettingsAboutUsComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
