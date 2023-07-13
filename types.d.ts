import {Store} from 'redux';
import * as preactLib from 'preact';
import * as preacti18nLib from 'preact-i18n';
import * as reduxLib from 'react-redux';
import {BasePlugin} from '@playkit-js/kaltura-player-js';

declare module '@playkit-js/kaltura-player-js' {
  export function setup(config: any): KalturaPlayer;
  export const ui: typeof PlaykitUI;
  export class FakeEvent implements CustomEvent {
    readonly payload: any;
    readonly AT_TARGET: number;
    readonly BUBBLING_PHASE: number;
    readonly CAPTURING_PHASE: number;
    readonly NONE: number;
    readonly bubbles: boolean;
    cancelBubble: boolean;
    readonly cancelable: boolean;
    readonly composed: boolean;
    readonly currentTarget: EventTarget | null;
    readonly defaultPrevented: boolean;
    readonly detail: any;
    readonly eventPhase: number;
    readonly isTrusted: boolean;
    returnValue: boolean;
    readonly srcElement: EventTarget | null;
    readonly target: EventTarget | null;
    readonly timeStamp: DOMHighResTimeStamp;
    readonly type: string;
    composedPath(): EventTarget[];
    composedPath(): EventTarget[];
    initCustomEvent(type: string, bubbles?: boolean, cancelable?: boolean, detail?: any): void;
    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
    preventDefault(): void;
    stopImmediatePropagation(): void;
    stopPropagation(): void;
  }
  export class BasePlugin<ConfigType> {
    protected config: ConfigType;
    protected static defaultConfig: {};
    public constructor(name: string, player: KalturaPlayer, config?: ConfigType);
    protected logger: Logger;
    protected loadMedia(): void;
    public player: KalturaPlayer;
    public reset(): void;
    public destroy(): void;
    public static isValid(): boolean;
    public eventManager: PlaykitUI.EventManager;
  }
  export function registerPlugin<ConfigType>(pluginName: string, plugin: IBasePlugin<ConfigType>): void;
}

type Target = KalturaPlayer | HTMLElement | Document;
type CallbackFunction = (...args: any) => void;

export interface IBasePlugin<ConfigType> {
  new (name: string, player: KalturaPlayer, config?: ConfigType): BasePlugin<ConfigType>;
}

export class KalturaPlayer {
  public setMedia(config: any): void;
  public registerService(pluginName: string, service: Object): void;
  public getService<T>(serviceName: string): T;
  public get ui(): UIWrapper;
  public get Event(): EventTypes;
  public get paused(): boolean;
  public get sources(): Sources;
  public configure(config: Object): void;
  public ready(): Promise<void>;
  public load(): void;
  public play(): void;
  public pause(): void;
  public getView(): HTMLElement;
  public getVideoElement(): HTMLVideoElement;
  public reset(isChangeMedia?: boolean): void;
  public isLive(): boolean;
  public isOnLiveEdge(): boolean;
  public isDvr(): boolean;
  public seekToLiveEdge(): void;
}

export class UIWrapper {
  public addComponent(component: any): () => void;
  public removeComponent(component: any): () => void;
  public get store(): Store;
}

export class UIManager {
  public store: Store;
}

export interface Logger {
  debug(message: any, ...optionalParams: any[]): void;
  info(message: any, ...optionalParams: any[]): void;
  trace(message: any, ...optionalParams: any[]): void;
  warn(message: any, ...optionalParams: any[]): void;
  error(message: any, ...optionalParams: any[]): void;
}

export interface EventTypes {
  Core: {[event: string]: string};
  UI: {[event: string]: string};
  Cast: {[event: string]: string};
  Playlist: {[event: string]: string};
}

export interface Sources {
  hls: any[];
  dash: any[];
  progressive: any[];
  image: any[];
  captions?: any[];
  thumbnails?: any;
  options: any;
  type: string;
  dvr: boolean;
  metadata: SourcesMetadata;
  id?: string;
  poster?: string;
  duration?: number;
  startTime?: number;
  vr: Object | null;
  imageSourceOptions?: any;
}

export interface SourcesMetadata {
  entryId?: string;
  name?: string;
  description?: string;
  mediaType?: string,
  metas?: Object;
  tags?: Object;
  epgId?: string;
  recordingId?: string
}



declare module PlaykitUI {
  export class EventManager {
    listen: (target: Target, event: string, cb: CallbackFunction) => void;
    listenOnce: (target: Target, event: string, cb: CallbackFunction) => void;
    unlisten: (target: Target, event: string, cb?: CallbackFunction) => void;
    destroy: () => void;
    removeAll: () => void;
  }

  export type SidePanelPosition = 'top' | 'bottom' | 'right' | 'left';
  export type SidePanelMode = 'alongside' | 'hidden' | 'over';
  export type ReservedPresetName = 'Playback' | 'Live' | 'Idle' | 'Ads' | 'Error';
  export const SidePanelOrientation: {
    VERTICAL: 'vertical';
    HORIZONTAL: 'horizontal';
  };

  export const SidePanelPositions: {
    LEFT: 'left';
    TOP: 'top';
    BOTTOM: 'bottom';
    RIGHT: 'right';
  };

  export const SidePanelModes: {
    ALONGSIDE: 'alongside';
    HIDDEN: 'hidden';
    OVER: 'over';
  };

  export const ReservedPresetNames: {
    Playback: 'Playback';
    Live: 'Live';
    Idle: 'Idle';
    Ads: 'Ads';
    Error: 'Error';
  };

  export const ReservedPresetAreas: {
    PlayerArea: 'PlayerArea',
    PresetArea: 'PresetArea',
    InteractiveArea: 'InteractiveArea',
    VideoArea: 'VideoArea',
    GuiArea: 'GuiArea',
    TopBar: 'TopBar',
    BottomBar: 'BottomBar',
    PresetFloating: 'PresetFloating',
    TopBarLeftControls: 'TopBarLeftControls',
    TopBarRightControls: 'TopBarRightControls',
    BottomBarLeftControls: 'BottomBarLeftControls',
    BottomBarRightControls: 'BottomBarRightControls',
    SidePanelTop: 'SidePanelTop',
    SidePanelLeft: 'SidePanelLeft',
    SidePanelRight: 'SidePanelRight',
    SidePanelBottom: 'SidePanelBottom',
    SeekBar: 'SeekBar',
    LoadingSpinner: 'LoadingSpinner'
  };

  export const reducers: {
    shell: {
      actions: {
        updateSidePanelMode: (
          position: SidePanelPosition,
          sidePanelMode: SidePanelMode
        ) => {
          type: string;
          position: SidePanelPosition;
          sidePanelMode: SidePanelMode;
        };
      };
    };
  };

  enum IconState {
    INACTIVE = 0,
    ACTIVE = 1
  }

  export const utils: {
    KeyMap: {
      TAB: 9;
      ENTER: 13;
      ESC: 27;
      SPACE: 32;
      END: 35;
      HOME: 36;
      LEFT: 37;
      UP: 38;
      RIGHT: 39;
      DOWN: 40;
      P: 80;
      C: 67;
      F: 70;
      M: 77;
      SEMI_COLON: 186;
      COMMA: 188;
      PERIOD: 190;
    };
  };

  export const Components: {
    Tooltip: preactLib.ComponentClass<{label: string}>;
    Icon: preactLib.ComponentClass<{
      id: string | number;
      path: string;
      state?: IconState;
      color?: string;
      activeColor?: string;
      width?: number;
      height?: number;
      viewBox?: string;
    }>;
    PLAYER_BREAK_POINTS: Record<string, number>;
    PLAYER_SIZE: {
      TINY: 'tiny';
      EXTRA_SMALL: 'extrasmall';
      SMALL: 'small';
      MEDIUM: 'medium';
      LARGE: 'large';
      EXTRA_LARGE: 'extralarge';
    };
  };
  export const style: {[cssClassName: string]: string};
  export const h: typeof preact.h;
  export const preact: typeof preactLib;
  export const redux: typeof reduxLib;
  export const preacti18n: typeof preacti18nLib;
  export const Event: any;
}
