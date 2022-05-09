import {Store} from 'redux';
import * as preact from 'preact';
import {BasePlugin} from "kaltura-player-js";

declare module 'kaltura-player-js' {
  export const ui: PlaykitUI
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
  export function registerPlugin(pluginName: string, plugin: IBasePlugin): void
}

export interface IBasePlugin {
  new(name: string, player: KalturaPlayer): BasePlugin;
}

export class KalturaPlayer {
  registerService(name: string, service: Object): void;
  get ui(): UIWrapper
}

export class UIWrapper {
  addComponent(component: any): () => void;
  removeComponent(component: any): () => void;
  _uiManager: UIManager;
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

export interface PlaykitUI {
  SidePanelOrientation: {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal'
  };

  SidePanelPositions: {
    LEFT: 'left',
    TOP: 'top',
    BOTTOM: 'bottom',
    RIGHT: 'right'
  };

  SidePanelModes: {
    ALONGSIDE: 'alongside',
    HIDDEN: 'hidden',
    OVER: 'over'
  };

  ReservedPresetNames: {
    Playback: 'Playback',
    Live: 'Live'
    Idle: 'Idle'
    Ads: 'Ads'
    Error: 'Error'
  };

  ReservedPresetAreas: {
    PresetFloating: 'PresetFloating',
    BottomBarLeftControls: 'BottomBarLeftControls',
    BottomBarRightControls: 'BottomBarRightControls',
    TopBarLeftControls: 'TopBarLeftControls',
    TopBarRightControls: 'TopBarRightControls',
    SidePanelTop: 'SidePanelTop',
    SidePanelLeft: 'SidePanelLeft',
    SidePanelRight: 'SidePanelRight',
    SidePanelBottom: 'SidePanelBottom',
    PresetArea: 'PresetArea',
    InteractiveArea: 'InteractiveArea',
    PlayerArea: 'PlayerArea',
    VideoArea: 'VideoArea'
  };

  reducers: {
    shell: {
      actions: {
        updateSidePanelMode: (position: string, sidePanelMode: string) => ({
          type: string,
          position: string,
          sidePanelMode: string
        }),
      }
    }
  },
  h: typeof preact.h,
  preact: typeof preact
}
