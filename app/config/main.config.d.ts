import { AppThemeType } from "../services/app-theme/app-theme.interfaces";

export interface IStatesConfig {
    home: any;
    settings: any;
    settingsGeneral: any;
    settingsAboutUs: any;
    favoritesArchive: any;
    showcaseWord: any;
}

export interface IMainConfig {
    appName: string;
    appTheme: AppThemeType;
    actionBarItems: any;
    columnsOrder: string[];
    states: IStatesConfig;
    loadingText: string;
    loadingAnimations: {
        default: string;
        defaultDark: string;
        daily: string;
        random: string;
        meme: string;
    };
    pushNotificationTopics: string[];
    loggingUrl: string;
    wordApi: {
        daily: string;
        random: string;
        meme: string;
        search: string;
    };
}
