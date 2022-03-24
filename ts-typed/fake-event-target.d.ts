declare function EventListener(event: KalturaPlayerTypes.FakeEvent): boolean | void;

declare namespace KalturaPlayerTypes {
  export interface FakeEventTarget {
    addEventListener(type: string, listener: EventListener);

    removeEventListener(type: string, listener: EventListener);

    registerPlugin(name: string, component: any): void;

    dispatchEvent(event: KalturaPlayerTypes.FakeEvent);
  }
}
