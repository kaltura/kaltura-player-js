interface FakeEvent {}

type CoreEventListener = (event: FakeEvent) => boolean | void;

declare namespace KalturaPlayerTypes {
  export interface Player {
    dimensions: {width: number; height: number};
    getActiveTracks(): {video: {width: number; height: number}};
    pause(): void;
    play(): void;
    isLive: () => boolean;
    isDvr: () => boolean;
    dispatchEvent(event: FakeEvent): boolean;
    seekToLiveEdge(): void;
    destroy(): void;
    reset(): void;
    registerService(name: string, service: Object): void;
    hasService(name: string): boolean;
    getService(name: string): Object;
    getView: () => Node;
    getMediaInfo: () => any;
    paused: boolean;
    seeking: boolean;
    isOnLiveEdge: () => boolean;
    loadMedia: (options: {entryId: string; ks?: string}) => void;
    getVideoElement(): HTMLVideoElement;
    addEventListener(type: string, listener: CoreEventListener): void;
    removeEventListener: (type: string, listener: CoreEventListener) => void;
    Event: Record<string, any>;
    currentTime: number;
    playbackRate: number;
    duration: number;
    ended: boolean;
    env: KalturaPlayerTypes.Env;
    configure: Function;
    ui: any;
    config: KalturaPlayerTypes.PlayerConfig;
    provider: any;
    cuePointManager: KalturaPlayerTypes.CuePointManager;
    ready: () => Promise<any>;
    sources: KalturaPlayerTypes.Sources;
    src?: string;
  }
}
