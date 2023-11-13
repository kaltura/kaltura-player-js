import {PKEventTypes} from '@playkit-js/playkit-js';

export type KPEventTypes = {
  Core: PKEventTypes;
  UI: { [event: string]: string };
  Cast: { [event: string]: string };
  Playlist: { [event: string]: string };
  VISIBILITY_CHANGE: 'visibilitychange';
};
