type Target = KalturaPlayerTypes.Player | KalturaPlayerTypes.FakeEventTarget | HTMLElement | Document;
type CallbackFunction = (...args: any) => void;

declare namespace KalturaPlayerTypes {
  export interface EventManager {
    listen: (target: Target, event: typeof EventType, cb: CallbackFunction) => void;
    listenOnce: (target: Target, event: typeof EventType, cb: CallbackFunction) => void;
    unlisten: (target: Target, event: typeof EventType, cb?: CallbackFunction) => void;
    destroy: () => void;
    removeAll: () => void;
  }
}
