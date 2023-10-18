declare const CustomMessageType: {
  [type: string]: string;
};
declare const CustomActionType: {
  [action: string]: string;
};
declare class CustomMessage {
  type: string;
  constructor(type: string);
}
declare class CustomEventMessage extends CustomMessage {
  event: string;
  payload: any;
  constructor(event: string, payload: any);
}
declare class CustomActionMessage extends CustomMessage {
  action: string;
  args: any;
  constructor(action: string, args: any);
}
export { CustomMessageType, CustomActionType, CustomMessage, CustomEventMessage, CustomActionMessage };
//# sourceMappingURL=custom-message.d.ts.map
