declare namespace KalturaPlayerTypes {
    export interface BasePlugin {
        player: KalturaPlayerTypes.Player;
        eventManager: KalturaPlayerTypes.EventManager;
        config: any;
        logger: KalturaPlayerTypes.Logger;
        getName(): string;
    }
}
