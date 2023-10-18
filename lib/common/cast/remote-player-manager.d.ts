import { BaseRemotePlayer } from './base-remote-player';
import { KalturaPlayer } from '../../kaltura-player';
import { ClassConstructor } from '../../types/utils/class-constructor';
declare class RemotePlayerManager {
  static _registry: Map<string, ClassConstructor<BaseRemotePlayer>>;
  static _logger: any;
  _remotePlayers: Map<string, BaseRemotePlayer>;
  static register(type: string, remotePlayer: BaseRemotePlayer): void;
  load(castConfig: Object, player: KalturaPlayer): void;
  startCasting(type?: string): Promise<any>;
  isCastAvailable(type?: string): boolean;
  destroy(): void;
  setIsCastInitiator(type: string, isCastInitiator: boolean): void;
  _getRemotePlayer(type?: string): BaseRemotePlayer | undefined;
}
export { RemotePlayerManager };
//# sourceMappingURL=remote-player-manager.d.ts.map
