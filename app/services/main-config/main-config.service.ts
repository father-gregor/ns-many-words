import { Injectable, Injector } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
    getString as nsGetString,
    hasKey as nsHasKey
} from "tns-core-modules/application-settings/application-settings";

/**
 * Configs
 */
import * as mainConfig from "../../config/main.config.json";
import * as statesConfig from "../../config/states.config.json";
import { IMainConfig, IDynamicConfig } from "../../config/main.config";

/**
 * Services
 */
import { LoggerService } from "../logger/logger.service";

@Injectable({
    providedIn: "root"
})
export class MainConfigService {
    public config: IMainConfig;
    public dynamicConfig: IDynamicConfig;

    constructor (
        private http: HttpClient,
        private injector: Injector
    ) {
        this.config = {...mainConfig.default};
        this.config.states = {...statesConfig.default};
        this.initDynamicConfig();

        const customColumnsOrder = nsGetString("customColumnsOrder") as any;
        if (customColumnsOrder) {
            this.config.columnsOrder = JSON.parse(customColumnsOrder);
        }
    }

    private async initDynamicConfig () {
        try {
            this.dynamicConfig = await this.http.get<IDynamicConfig>(this.config.dynamicConfigUrl, {
                params: {
                    mode: TNS_MODE
                },
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                })
            }).toPromise();
        }
        catch (err) {
            this.dynamicConfig = {ads: [], isAdsEnabled: true};
            const loggerService = this.injector.get(LoggerService);
            loggerService.error("mw_error_get_dynamic_config", err);
        }
        finally {
            this.config = Object.assign({}, this.config, this.dynamicConfig);
        }
    }
}
