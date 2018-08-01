// @flow
import {RemoteControl} from './remote-control';
import {BaseRemotePlayer} from './base-remote-player';
import getLogger from '../utils/logger';

class RemotePlayerManager {
  static _logger: any = getLogger('RemotePlayerManager');
  static _registry: Map<string, Function> = new Map();
  static _remotePlayers: Map<string, BaseRemotePlayer> = new Map();

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

  static load(castConfig: Object, remoteControl: RemoteControl): void {
    const registry = RemotePlayerManager._registry;
    registry.forEach((RemotePlayer: Function, type: string) => {
      RemotePlayerManager._logger.debug(`Load remote player of type ${type}`);
      RemotePlayerManager._remotePlayers.set(type, new RemotePlayer(castConfig, remoteControl));
    });
  }

  static startCasting(type?: string): Promise<*> {
    const remotePlayer = RemotePlayerManager._getRemotePlayer(type);
    if (remotePlayer) {
      return remotePlayer.startCasting();
    }
    return Promise.reject();
  }

  static isCastAvailable(type?: string): boolean {
    const remotePlayer = RemotePlayerManager._getRemotePlayer(type);
    if (remotePlayer) {
      return remotePlayer.isCastAvailable();
    }
    return false;
  }

  static _getRemotePlayer(type?: string): ?Object {
    const remotePlayers = RemotePlayerManager._remotePlayers;
    if (type && remotePlayers.get(type)) {
      return remotePlayers.get(type);
    } else if (remotePlayers.size > 0) {
      return Array.from(remotePlayers.values())[0];
    }
  }
}

export {RemotePlayerManager};
