import {Store} from 'redux';
import * as preactLib from 'preact';
import * as reduxLib from 'react-redux';
import {BasePlugin} from 'kaltura-player-js';

declare module 'kaltura-player-js' {
  export const ui: typeof PlaykitUI;
  export class FakeEvent implements CustomEvent {
    readonly payload: any
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
    protected constructor(name: string, player: KalturaPlayer, config: ConfigType);
    protected logger: Logger;
    protected loadMedia(): void;
    public player: KalturaPlayer;
    public reset(): void;
    public destroy(): void;
    public static isValid(): boolean;
    public eventManager: any;
  }
  export function registerPlugin<ConfigType>(pluginName: string, plugin: IBasePlugin<ConfigType>): void;
}

export interface IBasePlugin<ConfigType> {
  new (name: string, player: KalturaPlayer, config: ConfigType): BasePlugin<ConfigType>;
}

export class KalturaPlayer {
  public registerService(pluginName: string, service: Object): void;
  public getService<T>(serviceName: string): T;
  public get ui(): UIWrapper;
  public get Event(): EventTypes;
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
  Core: {[event: string]: string},
  UI: {[event: string]: string},
  Cast: {[event: string]: string},
  Playlist: {[event: string]: string}
}

declare module PlaykitUI {
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
    PresetFloating: 'PresetFloating';
    BottomBarLeftControls: 'BottomBarLeftControls';
    BottomBarRightControls: 'BottomBarRightControls';
    TopBarLeftControls: 'TopBarLeftControls';
    TopBarRightControls: 'TopBarRightControls';
    SidePanelTop: 'SidePanelTop';
    SidePanelLeft: 'SidePanelLeft';
    SidePanelRight: 'SidePanelRight';
    SidePanelBottom: 'SidePanelBottom';
    PresetArea: 'PresetArea';
    InteractiveArea: 'InteractiveArea';
    PlayerArea: 'PlayerArea';
    VideoArea: 'VideoArea';
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
    INACTIVE= 0,
    ACTIVE= 1
  }

  export const Components: {
    Icon : preactLib.ComponentClass<{id: string | number, path: string, state?: IconState, color?: string, activeColor?: string, width?: number, height?: number, viewBox?: string}>;
    PLAYER_SIZE: {
      TINY: 'tiny',
      EXTRA_SMALL: 'extrasmall',
      SMALL: 'small',
      MEDIUM: 'medium',
      LARGE: 'large',
      EXTRA_LARGE: 'extralarge'
    };
  };
  export const style: {[cssClassName: string]: string};
  export const h: typeof preact.h;
  export const preact: typeof preactLib;
  export const redux: typeof reduxLib;
}
