export type CustomErrorType = 
"mw_error_try_catch" | 
"mw_error_add_favorite" | 
"mw_error_remove_favorite" |
"mw_error_uncaught_exception";

export type CustomEventType = "";

export interface IAnalyticsLog {
    key: CustomErrorType | CustomEventType;
    parameters?: any[];
}
