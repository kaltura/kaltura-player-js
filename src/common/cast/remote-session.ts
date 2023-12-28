/**
 * @class RemoteSession
 * @param {string} id - Session ID.
 * @param {string} friendlyName - Receiver friendly name.
 * @param {boolean} [resuming] - Whether the session is resuming.
 */
class RemoteSession {
  private readonly _id: string;
  private readonly _friendlyName: string;
  private readonly _resuming: boolean | undefined;

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
  public get deviceFriendlyName(): string {
    return this._friendlyName;
  }

  /**
   * Session ID.
   * @type {string}
   * @instance
   * @memberof RemoteSession
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Whether the session is resuming.
   * @type {?boolean}
   * @instance
   * @memberof RemoteSession
   */
  public get resuming(): boolean | undefined {
    return this._resuming;
  }
}

export { RemoteSession };
