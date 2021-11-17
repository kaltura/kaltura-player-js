// @flow
import {RemoteControl} from './remote-control';
import {BaseRemotePlayer} from './base-remote-player';
import {getLogger} from '@playkit-js/playkit-js';
import {KalturaPlayer} from '../../kaltura-player';

class RemotePlayerManager {
  static _registry: Map<string, Function> = new Map();
  static _logger: any = getLogger('RemotePlayerManager');

  _remotePlayers: Map<string, BaseRemotePlayer> = new Map();

  static register(type: string, remotePlayer: Function): void {
    if (typeof remotePlayer === 'function') {
      if (!RemotePlayerManager._registry.has(type)) {
        RemotePlayerManager._logger.debug(`Register remote player of type ${type}`);
        RemotePlayerManager._registry.set(type, remotePlayer);
      } else {
        RemotePlayerManager._logger.debug(`Remote player of type ${type} is already registered`);
      }
    } else {
      RemotePlayerManager._logger.debug(`remote player must be instance of BaseRemotePlayer`);
    }
  }

  load(castConfig: Object, player: KalturaPlayer): void {
    const registry = RemotePlayerManager._registry;
    registry.forEach((RemotePlayer: Function, type: string) => {
      RemotePlayerManager._logger.debug(`Load remote player of type ${type}`);
      const remotePlayer = new RemotePlayer(castConfig, new RemoteControl(player), player.config.targetId);
      this._remotePlayers.set(type, remotePlayer);
    });
  }

  startCasting(type?: string): Promise<*> {
    RemotePlayerManager._logger.debug(`Start casting`);
    const remotePlayer = this._getRemotePlayer(type);
    if (remotePlayer) {
      return remotePlayer.startCasting();
    }
    return Promise.reject();
  }

  isCastAvailable(type?: string): boolean {
    const remotePlayer = this._getRemotePlayer(type);
    if (remotePlayer) {
      RemotePlayerManager._logger.debug(`isCastAvailable: ${remotePlayer.isCastAvailable()}`);
      return remotePlayer.isCastAvailable();
    }
    return false;
  }

  destroy(): void {
    const remotePlayers = this._remotePlayers;
    Array.from(remotePlayers.values()).forEach(remotePlayer => remotePlayer.destroy());
  }

  setIsCastInitiator(type?: string, isCastInitiator: boolean) {
    const remotePlayer = this._getRemotePlayer(type);
    if (remotePlayer) {
      remotePlayer._isCastInitiator = isCastInitiator;
    }
  }

  _getRemotePlayer(type?: string): ?Object {
    const remotePlayers = this._remotePlayers;
    if (type && remotePlayers.get(type)) {
      return remotePlayers.get(type);
    } else if (remotePlayers.size > 0) {
      return Array.from(remotePlayers.values())[0];
    }
  }
}

export {RemotePlayerManager};
