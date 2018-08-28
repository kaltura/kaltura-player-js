// @flow
const CustomMessageType: {[type: string]: string} = {
  EVENT: 'event',
  AD_EVENT: 'ad_event'
};

class CustomMessage {
  type: string;

  constructor(type: string) {
    this.type = type;
  }
}

class CustomEventMessage extends CustomMessage {
  event: string;
  payload: any;

  constructor(event: string, payload: any, eventType?: string) {
    super(eventType || CustomMessageType.EVENT);
    this.event = event;
    this.payload = payload;
  }
}

class CustomAdEventMessage extends CustomEventMessage {
  constructor(event: string, payload: any) {
    super(event, payload, CustomMessageType.AD_EVENT);
  }
}

export {CustomMessageType, CustomEventMessage, CustomAdEventMessage};
