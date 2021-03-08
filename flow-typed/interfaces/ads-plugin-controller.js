//@flow

declare interface IAdsPluginController {
  skipAd(): void;
  onPlaybackEnded(): Promise<void>;
  +active: boolean;
  +done: boolean;
  +name: string;
}
