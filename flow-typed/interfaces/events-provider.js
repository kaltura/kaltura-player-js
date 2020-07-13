// @flow

declare interface IEventsProvider {
  getEvents(): {[event: string]: string};
}
