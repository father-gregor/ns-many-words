import { Injectable } from "@angular/core";

import * as mainConfig from "../../config/main.config.json";
import { IMainConfig } from "~/config/main.config.js";

@Injectable()
export class MainConfigService {
    public config: IMainConfig;

    constructor () {
        this.config = mainConfig as any;
    }
}
