declare namespace KalturaPlayerTypes {
  export interface ILoader {
    requests: RequestBuilder[];
    response: any;
    isValid(): boolean;
  }
}
