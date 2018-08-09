import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as mainConfig from "../../config/main.config.json";
import { PageDataStorageService } from '~/services/page-data-storage/page-data-storage.service';
import { IWord } from '~/modules/word-box/word-box.definitions';

@Component({
    selector: "ShowcaseWord",
    moduleId: module.id,
    templateUrl: "./showcase-word.html"
})
export class ShowcaseWordComponent implements OnInit {
    public word: IWord;
    public actionBarTitle: string = (mainConfig as any).showcaseWord.title;

    constructor (
        private route: ActivatedRoute, 
        private PageDataStorage: PageDataStorageService<IWord>
    ) {}

    ngOnInit () {
        this.word = this.PageDataStorage.current;
    }
}