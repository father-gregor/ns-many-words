import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { HomeComponent } from "~/modules/home/home.component";
import { FavoriteWordsComponent } from "~/modules/favorite-words/favorite-words.component";
import { ShowcaseWordComponent } from '~/modules/showcase-word/showcase-word.component';

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "favorites-archive", component: FavoriteWordsComponent },
    { path: "showcase-word", component: ShowcaseWordComponent}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
