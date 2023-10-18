import { BaseRemotePlayer } from './base-remote-player';
import { RemoteSession } from './remote-session';
import { PlayerSnapshot } from './player-snapshot';
import { RemotePlayerUI } from './remote-player-ui';

/**
 * @class RemotePayload
 * @param {BaseRemotePlayer} player - The active remote player.
 */
class RemotePayload {
  private _player: BaseRemotePlayer;

  constructor(player: BaseRemotePlayer) {
    this._player = player;
  }

  /**
   * The active remote player.
   * @type {BaseRemotePlayer}
   * @instance
   * @memberof RemotePayload
   */
  public get player(): BaseRemotePlayer {
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
  private _ui: RemotePlayerUI | undefined;
  private _session: RemoteSession;

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
  public get ui(): RemotePlayerUI | undefined {
    return this._ui;
  }

  /**
   * Remote session.
   * @type {RemoteSession}
   * @instance
   * @memberof RemoteConnectedPayload
   */
  public get session(): RemoteSession {
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
  private readonly _snapshot: PlayerSnapshot;

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
  public get snapshot(): PlayerSnapshot {
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
  private readonly _available: boolean;

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
  public get available(): boolean {
    return this._available;
  }
}

export { RemotePayload, RemoteConnectedPayload, RemoteDisconnectedPayload, RemoteAvailablePayload };
