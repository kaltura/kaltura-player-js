type Target = KalturaPlayerTypes.Player | HTMLElement | Document;
type CallbackFunction = (...args: any) => void;

declare namespace KalturaPlayerTypes {
  export interface EventManager {
    listen: (target: Target, event: typeof EventType, cb: CallbackFunction) => void;
    listenOnce: (target: Target, event: typeof EventType, cb: CallbackFunction) => void;
    unlisten: (target: Target, event: typeof EventType) => void;
    destroy: () => void;
    removeAll: () => void;
  }
}
