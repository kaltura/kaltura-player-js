// @flow

/**
 * @class RemoteSession
 * @param {string} id - Session ID.
 * @param {string} friendlyName - Receiver friendly name.
 * @param {boolean} [resuming] - Whether the session is resuming.
 */
class RemoteSession {
  _id: string;
  _friendlyName: string;
  _resuming: ?boolean;

  constructor(id: string, friendlyName: string, resuming?: boolean) {
    this._id = id;
    this._friendlyName = friendlyName;
    this._resuming = resuming;
  }

  /**
   * Receiver friendly name.
   * @type {string}
   * @instance
   * @memberof RemoteSession
   */
  get deviceFriendlyName(): string {
    return this._friendlyName;
  }

  /**
   * Session ID.
   * @type {string}
   * @instance
   * @memberof RemoteSession
   */
  get id(): string {
    return this._id;
  }

  /**
   * Whether the session is resuming.
   * @type {?boolean}
   * @instance
   * @memberof RemoteSession
   */
  get resuming(): ?boolean {
    return this._resuming;
  }
}

export {RemoteSession};
