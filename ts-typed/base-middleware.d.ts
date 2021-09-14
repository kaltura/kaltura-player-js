declare namespace KalturaPlayerTypes {
    export interface BaseMiddleware {
        callNext(next: Function): void;
    }
}
