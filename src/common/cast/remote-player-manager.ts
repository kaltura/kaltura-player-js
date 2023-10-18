import { RemoteControl } from './remote-control';
import { BaseRemotePlayer } from './base-remote-player';
import { getLogger } from '@playkit-js/playkit-js';
import { KalturaPlayer } from '../../kaltura-player';
import { ClassConstructor } from '../../types/utils/class-constructor';

class RemotePlayerManager {
  private static _registry: Map<string, ClassConstructor<BaseRemotePlayer>> = new Map();
  private static _logger: any = getLogger('RemotePlayerManager');

  private _remotePlayers: Map<string, BaseRemotePlayer> = new Map();

  public static register(type: string, remotePlayer: BaseRemotePlayer): void {
    if (typeof remotePlayer === 'function') {
      if (!RemotePlayerManager._registry.has(type)) {
        RemotePlayerManager._logger.debug(`Register remote player of type ${type}`);
        RemotePlayerManager._registry.set(type, remotePlayer);
      } else {
        RemotePlayerManager._logger.debug(`Remote player of type ${type} is already registered`);
      }
    } else {
      RemotePlayerManager._logger.debug('remote player must be instance of BaseRemotePlayer');
    }
  }

  public load(castConfig: any, player: KalturaPlayer): void {
    const registry = RemotePlayerManager._registry;
    registry.forEach((RemotePlayer: ClassConstructor<BaseRemotePlayer>, type: string) => {
      RemotePlayerManager._logger.debug(`Load remote player of type ${type}`);
      const remotePlayer: BaseRemotePlayer = new RemotePlayer(castConfig, new RemoteControl(player), player.config.targetId);
      this._remotePlayers.set(type, remotePlayer);
    });
  }

  public startCasting(type?: string): Promise<any> {
    RemotePlayerManager._logger.debug('Start casting');
    const remotePlayer = this._getRemotePlayer(type);
    if (remotePlayer) {
      return remotePlayer.startCasting();
    }
    return Promise.reject();
  }

  public isCastAvailable(type?: string): boolean {
    const remotePlayer = this._getRemotePlayer(type);
    if (remotePlayer) {
      RemotePlayerManager._logger.debug(`isCastAvailable: ${remotePlayer.isCastAvailable()}`);
      return remotePlayer.isCastAvailable();
    }
    return false;
  }

  public destroy(): void {
    const remotePlayers = this._remotePlayers;
    Array.from(remotePlayers.values()).forEach((remotePlayer) => remotePlayer.destroy());
  }

  public setIsCastInitiator(type: string, isCastInitiator: boolean): void {
    const remotePlayer = this._getRemotePlayer(type);
    if (remotePlayer) {
      remotePlayer.isCastInitiator = isCastInitiator;
    }
  }

  private _getRemotePlayer(type?: string): BaseRemotePlayer | undefined {
    const remotePlayers = this._remotePlayers;
    if (type && remotePlayers.get(type)) {
      return remotePlayers.get(type);
    } else if (remotePlayers.size > 0) {
      return Array.from(remotePlayers.values())[0];
    }
  }
}

export { RemotePlayerManager };
