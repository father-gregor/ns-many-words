import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { HomeComponent } from "./components/home/home.component";
import { FavoriteWordsComponent } from "./components/list-words/favorite-words/favorite-words.component";
import { ShowcaseWordComponent } from "./components/showcase-word/showcase-word.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { SettingsGeneralComponent } from "./components/settings/settings-general/setting-general.component";
import { SettingsAboutUsComponent } from "./components/settings/settings-about-us/settings-about-us.component";
import { SearchWordsComponent } from "./components/search-words/search-words.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "favorites-archive", component: FavoriteWordsComponent },
    { path: "showcase-word", component: ShowcaseWordComponent },
    { path: "search-words", component: SearchWordsComponent},
    { path: "settings", component: SettingsComponent },
    { path: "settings-entry/general", component: SettingsGeneralComponent },
    { path: "settings-entry/about-us", component: SettingsAboutUsComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
