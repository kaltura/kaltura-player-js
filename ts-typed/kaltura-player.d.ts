declare module 'global' {
  declare global {
    const KalturaPlayer: {
      providers: {
        RequestBuilder: any;
        ResponseTypes: any;
        ProviderParser: any;
      };
      ui: {
        EventType: Record<string, string>;
        redux: {
          connect: (...args: any) => any;
          useSelector: (...args: any) => any;
        };
        reducers: Record<string, {actions: Record<string, unknown>[]}>;
        createPortal: (children: any, domElement: HTMLElement) => void;
        utils: {
          getLogger: (name: string) => KalturaPlayerTypes.Logger;
          bindActions(actions: Record<string, unknown>[]): (...args: any) => void;
          KeyMap: Record<string, number>;
          toHHMMSS: (seconds: number) => string;
        };
        components: {
          SeekBarPlaybackContainer: any;
          Overlay: any;
          withPlayer: any;
          Tooltip: any;
          Icon: any;
          IconType: any;
          IconState: any;
          PLAYER_SIZE: Record<string, string>;
          Remove: string;
          Settings: {
            displayName: string;
          };
          PrevNext: any;
          PrePlaybackPlayOverlay: any;
        };
        style: any;
        preactHooks: any;
        preacti18n: any;
      };
      core: {
        EventType: Record<string, string>;
        FakeEvent: any;
        FakeEventTarget: {
          new (...args: any[]): KalturaPlayerTypes.FakeEventTarget;
        }
        Error: any;
        StateType: Record<string, string>;
        MediaType: Record<string, string>;
        registerPlugin(name: string, component: any): void;
        BasePlugin: {
          new (...args: any[]): KalturaPlayerTypes.BasePlugin;
        };
        BaseMiddleware: {
          new (): KalturaPlayerTypes.BaseMiddleware;
        };
        FakeEventTarget: {
          new (): KalturaPlayerTypes.FakeEventTarget;
        };
        utils: {
          Object: {
            mergeDeep(target: Record<string, any>, ...sources: Record<string, any>[]);
          };
        };
      };
      cuepoint: {[key: string]: string};
      getPlayer(targetId?: string): any;
      setup(options: any): KalturaPlayer;
    };
  }
}
