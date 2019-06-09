import { Injectable } from "@angular/core";
import {
    getString as nsGetString,
    hasKey as nsHasKey
} from "tns-core-modules/application-settings/application-settings";

import * as mainConfig from "../../config/main.config.json";
import * as statesConfig from "../../config/states.config.json";
import { IMainConfig } from "~/config/main.config";

@Injectable()
export class MainConfigService {
    public config: IMainConfig;

    constructor () {
        this.config = {...mainConfig.default};
        this.config.states = {...statesConfig.default};

        const customColumnsOrder = nsGetString("customColumnsOrder") as any;
        if (customColumnsOrder) {
            this.config.columnsOrder = JSON.parse(customColumnsOrder);
        }
    }
}
