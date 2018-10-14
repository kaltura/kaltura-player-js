// @flow
class RemoteSession {
  _id: string;
  _friendlyName: string;
  _resuming: ?boolean;

  constructor(id: string, friendlyName: string, resuming?: boolean) {
    this._id = id;
    this._friendlyName = friendlyName;
    this._resuming = resuming;
  }

  get deviceFriendlyName(): string {
    return this._friendlyName;
  }

  get id(): string {
    return this._id;
  }

  get resuming(): ?boolean {
    return this._resuming;
  }
}

export {RemoteSession};
