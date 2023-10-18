import type { TextStyle } from './text-style';
import { TextTrackDisplaySetting } from './text-track-display-setting';

export interface TextConfig {
  enableCEA708Captions: boolean;
  useShakaTextTrackDisplay: boolean;
  useNativeTextTrack: boolean;
  textTrackDisplaySetting: TextTrackDisplaySetting;
  textStyle: TextStyle;
  forceCenter: boolean;
  captionsTextTrack1Label: string;
  captionsTextTrack1LanguageCode: string;
  captionsTextTrack2Label: string;
  captionsTextTrack2LanguageCode: string;
}
