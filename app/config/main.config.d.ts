export interface IMainConfig {
    appName: string;
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
    wordApi: any;
}
