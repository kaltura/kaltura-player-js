import { KalturaPlayer } from '../../kaltura-player';
/**
 * @class RemoteControl
 * @param {KalturaPlayer} player - The Kaltura player.
 */
declare class RemoteControl {
  static _logger: any;
  /**
   * Gets the player snapshot.
   * @returns {PlayerSnapshot} - player snapshot.
   * @memberof RemoteControl
   * @instance
   */
  getPlayerSnapshot: Function;
  /**
   * Gets the UI wrapper.
   * @returns {UIWrapper} - The UI wrapper.
   * @memberof RemoteControl
   * @instance
   */
  getUIWrapper: Function;
  /**
   * On remote device disconnected handler.
   * @param {RemoteDisconnectedPayload} payload - disconnected payload.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  onRemoteDeviceDisconnected: Function;
  /**
   * On remote device connected handler.
   * @param {RemoteConnectedPayload} payload - connected payload.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  onRemoteDeviceConnected: Function;
  /**
   * On remote device available handler.
   * @param {RemoteAvailablePayload} payload - available payload.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  onRemoteDeviceAvailable: Function;
  /**
   * On remote device connecting handler.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   * @fires CastEventType:CAST_SESSION_STARTING
   */
  onRemoteDeviceConnecting: Function;
  /**
   * On remote device disconnecting handler.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  onRemoteDeviceDisconnecting: Function;
  /**
   * On remote device connect failed handler.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  onRemoteDeviceConnectFailed: Function;
  constructor(player: KalturaPlayer);
}
export { RemoteControl };
//# sourceMappingURL=remote-control.d.ts.map
