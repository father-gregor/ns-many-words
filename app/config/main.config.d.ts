import { AppThemeType } from "~/services/app-theme/app-theme.interfaces";

export interface IMainConfig {
    appName: string;
    appTheme: AppThemeType;
    actionBarItems: any;
    states: {
        home: any;
        settings: any;
        settingsGeneral: any;
        settingsAboutUs: any;
        favoritesArchive: any;
        showcaseWord: any;
    };
    loadingText: string;
    pushNotificationTopics: string[];
    loggingUrl: string;
    wordApi: {
        daily: string;
        random: string;
        meme: string;
    };
}
