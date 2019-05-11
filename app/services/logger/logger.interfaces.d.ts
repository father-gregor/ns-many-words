export type CustomErrorType = "mw_error_try_catch" | "mw_error_add_favorite" | "mw_error_remove_favorite";

export type CustomEventType = "";

export interface IAnalyticsLog {
    key: CustomErrorType | CustomEventType;
    parameters?: any[];
}
