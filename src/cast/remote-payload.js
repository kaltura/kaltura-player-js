// @flow
import {BaseRemotePlayer} from './base-remote-player';
import {RemoteSession} from './remote-session';
import {PlayerSnapshot} from './player-snapshot';
import {RemotePlayerUI} from './remote-player-ui';

/**
 * @class RemotePayload
 * @param {BaseRemotePlayer} player - The active remote player.
 */
class RemotePayload {
  _player: BaseRemotePlayer;

  constructor(player: BaseRemotePlayer) {
    this._player = player;
  }

  /**
   * The active remote player.
   * @type {BaseRemotePlayer}
   * @instance
   * @memberof RemotePayload
   */
  get player(): BaseRemotePlayer {
    return this._player;
  }
}

/**
 * @class RemoteConnectedPayload
 * @param {BaseRemotePlayer} player - The active remote player.
 * @param {RemoteSession} session - The remote session.
 * @param {RemotePlayerUI} [ui] - Optional remote player UI preset.
 * @extends RemotePayload
 */
class RemoteConnectedPayload extends RemotePayload {
  _ui: RemotePlayerUI;
  _session: RemoteSession;

  constructor(player: BaseRemotePlayer, session: RemoteSession, ui?: RemotePlayerUI) {
    super(player);
    this._session = session;
    if (ui) {
      this._ui = ui;
    }
  }

  /**
   * Remote player UI preset.
   * @type {?RemotePlayerUI}
   * @instance
   * @memberof RemoteConnectedPayload
   */
  get ui(): ?RemotePlayerUI {
    return this._ui;
  }

  /**
   * Remote session.
   * @type {RemoteSession}
   * @instance
   * @memberof RemoteConnectedPayload
   */
  get session(): ?RemoteSession {
    return this._session;
  }
}

/**
 * @class RemoteDisconnectedPayload
 * @param {BaseRemotePlayer} player - The active remote player.
 * @param {PlayerSnapshot} snapshot - The remote player snapshot.
 * @extends RemotePayload
 */
class RemoteDisconnectedPayload extends RemotePayload {
  _snapshot: PlayerSnapshot;

  constructor(player: BaseRemotePlayer, snapshot: PlayerSnapshot) {
    super(player);
    this._snapshot = snapshot;
  }

  /**
   * Remote player snapshot.
   * @type {PlayerSnapshot}
   * @instance
   * @memberof RemoteDisconnectedPayload
   */
  get snapshot(): PlayerSnapshot {
    return this._snapshot;
  }
}

/**
 * @class RemoteAvailablePayload
 * @param {BaseRemotePlayer} player - The active remote player.
 * @param {boolean} available - Remote player availability.
 * @extends RemotePayload
 */
class RemoteAvailablePayload extends RemotePayload {
  _available: boolean;

  constructor(player: BaseRemotePlayer, available: boolean) {
    super(player);
    this._available = available;
  }

  /**
   * Remote player availability.
   * @type {boolean}
   * @instance
   * @memberof RemoteAvailablePayload
   */
  get available(): boolean {
    return this._available;
  }
}

export {RemotePayload, RemoteConnectedPayload, RemoteDisconnectedPayload, RemoteAvailablePayload};
