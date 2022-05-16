import {Store} from 'redux';
import * as preactLib from 'preact';
import {BasePlugin} from 'kaltura-player-js';

declare module 'kaltura-player-js' {
  export const ui: typeof PlaykitUI;
  export class BasePlugin {
    protected static defaultConfig: {};
    protected constructor(name: string, player: KalturaPlayer);
    protected logger: Logger;
    protected loadMedia(): void;
    public player: KalturaPlayer;
    public reset(): void;
    public destroy(): void;
    public static isValid(): boolean;
  }
  export function registerPlugin(pluginName: string, plugin: IBasePlugin): void;
}

export interface IBasePlugin {
  new (name: string, player: KalturaPlayer): BasePlugin;
}

export class KalturaPlayer {
  public registerService(pluginName: string, service: Object): void;
  public getService<T>(serviceName: string): T;
  public get ui(): UIWrapper;
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
  export const style: {[cssClassName: string]: string};
  export const h: typeof preact.h;
  export const preact: typeof preactLib;
}
