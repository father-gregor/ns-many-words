import { AppThemeType } from "../services/app-theme/app-theme.interfaces";

export interface IStatesConfig {
    home: any;
    settings: any;
    settingsGeneral: any;
    settingsAboutUs: any;
    settingsCredits: any;
    favoritesArchive: any;
    showcaseWord: any;
}

export interface IAdConfig {
    id: string;
    android: string;
    ios: string;
    keywords?: string[]
}

export interface IDynamicConfig {
    isAdsEnabled: boolean;
    ads: IAdConfig[];
}

export interface IMainConfig extends IDynamicConfig {
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
    speechRecognition: {
        activeAnimationLight: string;
        activeAnimationDark: string;
    };
    pushNotificationTopics: string[];
    loggingUrl: string;
    wordApi: {
        daily: string;
        random: string;
        meme: string;
        search: string;
    };
    dynamicConfigUrl: string;
}
