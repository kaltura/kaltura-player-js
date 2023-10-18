// @flow
const CustomMessageType: { [type: string]: string } = {
  ACTION: 'action',
  EVENT: 'event'
};

const CustomActionType: { [action: string]: string } = {
  SKIP_AD: 'skipAd'
};

class CustomMessage {
  public type: string;

  constructor(type: string) {
    this.type = type;
  }
}

class CustomEventMessage extends CustomMessage {
  public event: string;
  public payload: any;

  constructor(event: string, payload: any) {
    super(CustomMessageType.EVENT);
    this.event = event;
    this.payload = payload;
  }
}

class CustomActionMessage extends CustomMessage {
  public action: string;
  public args: any;

  constructor(action: string, args: any) {
    super(CustomMessageType.ACTION);
    this.action = action;
    this.args = args;
  }
}

export { CustomMessageType, CustomActionType, CustomMessage, CustomEventMessage, CustomActionMessage };
