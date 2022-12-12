interface FakeEvent {}

declare namespace KalturaPlayerTypes {
  export interface FakeEventTarget {
    addEventListener(type: string, listener: (...args: any) => void);
    removeEventListener(type: string, listener: (...args: any) => void);
    dispatchEvent(event: FakeEvent);
  }
}
