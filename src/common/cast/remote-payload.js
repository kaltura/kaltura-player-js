// @flow
import {BaseRemotePlayer} from './base-remote-player'
import {RemoteSession} from './remote-session'
import {PlayerSnapshot} from './player-snapshot'
import {RemotePlayerUI} from './remote-player-ui'

class RemotePayload {
  _player: BaseRemotePlayer;

  constructor(player: BaseRemotePlayer) {
    this._player = player;
  }

  get player(): BaseRemotePlayer {
    return this._player;
  }
}

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

  get ui(): ?RemotePlayerUI {
    return this._ui;
  }

  get session(): ?RemoteSession {
    return this._session;
  }
}

class RemoteDisconnectedPayload extends RemotePayload {
  _snapshot: PlayerSnapshot;

  constructor(player: BaseRemotePlayer, snapshot: PlayerSnapshot) {
    super(player);
    this._snapshot = snapshot;
  }

  get snapshot(): PlayerSnapshot {
    return this._snapshot;
  }
}

class RemoteAvailablePayload extends RemotePayload {
  _available: boolean;

  constructor(player: BaseRemotePlayer, available: boolean) {
    super(player);
    this._available = available;
  }

  get available(): boolean {
    return this._available;
  }
}

export {RemotePayload, RemoteConnectedPayload, RemoteDisconnectedPayload, RemoteAvailablePayload};
