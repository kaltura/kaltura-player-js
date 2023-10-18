import { RemotePlayerManager } from './remote-player-manager';
import { PlayerSnapshot } from './player-snapshot';
import { RemoteControl } from './remote-control';
import { RemoteSession } from './remote-session';
import { BaseRemotePlayer } from './base-remote-player';
import { RemoteAvailablePayload, RemoteConnectedPayload, RemoteDisconnectedPayload } from './remote-payload';
import { RemotePlayerUI } from './remote-player-ui';
import { TextStyleConverter } from './text-style-convertor';
import { CustomActionMessage, CustomEventMessage, CustomMessage } from './custom-message';
declare const cast: {
  registerRemotePlayer: typeof RemotePlayerManager.register;
  PlayerSnapshot: typeof PlayerSnapshot;
  RemoteControl: typeof RemoteControl;
  RemoteSession: typeof RemoteSession;
  BaseRemotePlayer: typeof BaseRemotePlayer;
  RemoteConnectedPayload: typeof RemoteConnectedPayload;
  RemoteDisconnectedPayload: typeof RemoteDisconnectedPayload;
  RemoteAvailablePayload: typeof RemoteAvailablePayload;
  RemotePlayerUI: typeof RemotePlayerUI;
  CastEventType: {
    [event: string]: string;
  };
  RemotePlayerType: {
    [type: string]: string;
  };
  TextStyleConverter: typeof TextStyleConverter;
  CustomEventMessage: typeof CustomEventMessage;
  CustomActionMessage: typeof CustomActionMessage;
  CustomMessageType: {
    [type: string]: string;
  };
  CustomActionType: {
    [action: string]: string;
  };
  CustomMessage: typeof CustomMessage;
};
export { cast };
//# sourceMappingURL=index.d.ts.map
