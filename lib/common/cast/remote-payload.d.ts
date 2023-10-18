import { BaseRemotePlayer } from './base-remote-player';
import { RemoteSession } from './remote-session';
import { PlayerSnapshot } from './player-snapshot';
import { RemotePlayerUI } from './remote-player-ui';
/**
 * @class RemotePayload
 * @param {BaseRemotePlayer} player - The active remote player.
 */
declare class RemotePayload {
  _player: BaseRemotePlayer;
  constructor(player: BaseRemotePlayer);
  /**
   * The active remote player.
   * @type {BaseRemotePlayer}
   * @instance
   * @memberof RemotePayload
   */
  get player(): BaseRemotePlayer;
}
/**
 * @class RemoteConnectedPayload
 * @param {BaseRemotePlayer} player - The active remote player.
 * @param {RemoteSession} session - The remote session.
 * @param {RemotePlayerUI} [ui] - Optional remote player UI preset.
 * @extends RemotePayload
 */
declare class RemoteConnectedPayload extends RemotePayload {
  _ui: RemotePlayerUI | undefined;
  _session: RemoteSession;
  constructor(player: BaseRemotePlayer, session: RemoteSession, ui?: RemotePlayerUI);
  /**
   * Remote player UI preset.
   * @type {?RemotePlayerUI}
   * @instance
   * @memberof RemoteConnectedPayload
   */
  get ui(): RemotePlayerUI | undefined;
  /**
   * Remote session.
   * @type {RemoteSession}
   * @instance
   * @memberof RemoteConnectedPayload
   */
  get session(): RemoteSession;
}
/**
 * @class RemoteDisconnectedPayload
 * @param {BaseRemotePlayer} player - The active remote player.
 * @param {PlayerSnapshot} snapshot - The remote player snapshot.
 * @extends RemotePayload
 */
declare class RemoteDisconnectedPayload extends RemotePayload {
  _snapshot: PlayerSnapshot;
  constructor(player: BaseRemotePlayer, snapshot: PlayerSnapshot);
  /**
   * Remote player snapshot.
   * @type {PlayerSnapshot}
   * @instance
   * @memberof RemoteDisconnectedPayload
   */
  get snapshot(): PlayerSnapshot;
}
/**
 * @class RemoteAvailablePayload
 * @param {BaseRemotePlayer} player - The active remote player.
 * @param {boolean} available - Remote player availability.
 * @extends RemotePayload
 */
declare class RemoteAvailablePayload extends RemotePayload {
  _available: boolean;
  constructor(player: BaseRemotePlayer, available: boolean);
  /**
   * Remote player availability.
   * @type {boolean}
   * @instance
   * @memberof RemoteAvailablePayload
   */
  get available(): boolean;
}
export { RemotePayload, RemoteConnectedPayload, RemoteDisconnectedPayload, RemoteAvailablePayload };
//# sourceMappingURL=remote-payload.d.ts.map
