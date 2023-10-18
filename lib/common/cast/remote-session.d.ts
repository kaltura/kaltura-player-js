/**
 * @class RemoteSession
 * @param {string} id - Session ID.
 * @param {string} friendlyName - Receiver friendly name.
 * @param {boolean} [resuming] - Whether the session is resuming.
 */
declare class RemoteSession {
  _id: string;
  _friendlyName: string;
  _resuming: boolean | undefined;
  constructor(id: string, friendlyName: string, resuming?: boolean);
  /**
   * Receiver friendly name.
   * @type {string}
   * @instance
   * @memberof RemoteSession
   */
  get deviceFriendlyName(): string;
  /**
   * Session ID.
   * @type {string}
   * @instance
   * @memberof RemoteSession
   */
  get id(): string;
  /**
   * Whether the session is resuming.
   * @type {?boolean}
   * @instance
   * @memberof RemoteSession
   */
  get resuming(): boolean | undefined;
}
export { RemoteSession };
//# sourceMappingURL=remote-session.d.ts.map
