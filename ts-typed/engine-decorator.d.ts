interface FakeEvent {
    type: string;
}
declare namespace KalturaPlayerTypes {
    export interface IEngineDecorator {
        dispatchEvent(event: FakeEvent): boolean;
        active: boolean;
    }
    export interface IEngineDecoratorProvider {
        getEngineDecorator(engine: any, dispatchEventHandler: Function): IEngineDecorator;
    }
}
