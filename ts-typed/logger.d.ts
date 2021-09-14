declare namespace KalturaPlayerTypes {
  export interface Logger {
    debug(message: string): void;

    info(message: string): void;

    trace(message: string): void;

    warn(message: string): void;

    error(message: string): void;
  }
}
