// @flow
import {RemotePlayerManager} from './remote-player-manager';
import {PlayerSnapshot} from './player-snapshot';
import {RemoteControl} from './remote-control';
import {CastEventType} from './cast-event-type';
import {RemoteSession} from './remote-session';
import {BaseRemotePlayer} from './base-remote-player';
import {RemoteAvailablePayload, RemoteConnectedPayload, RemoteDisconnectedPayload} from './remote-payload';
import {RemotePlayerUI} from './remote-player-ui';
import {RemotePlayerType} from './remote-player-type';
import {TextStyleConverter} from './text-style-convertor';
import {CustomAdEventMessage, CustomEventMessage, CustomMessageType} from './custom-message';

const cast = {
  registerRemotePlayer: RemotePlayerManager.register,
  PlayerSnapshot,
  RemoteControl,
  RemoteSession,
  BaseRemotePlayer,
  RemoteConnectedPayload,
  RemoteDisconnectedPayload,
  RemoteAvailablePayload,
  RemotePlayerUI,
  CastEventType,
  RemotePlayerType,
  TextStyleConverter,
  CustomEventMessage,
  CustomAdEventMessage,
  CustomMessageType
};

export {cast};
