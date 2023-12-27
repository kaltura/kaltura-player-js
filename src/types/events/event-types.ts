import {PKEventTypes} from '@playkit-js/playkit-js';
import { UIEventType } from "@playkit-js/playkit-js-ui";
import { CastEventType } from "../../common/cast/cast-event-type";
import { PlaylistEventType } from "../../common/playlist/playlist-event-type";

export type KPEventTypes = {
  Core: PKEventTypes;
  UI: typeof UIEventType;
  Cast: typeof CastEventType;
  Playlist: typeof PlaylistEventType;
  VISIBILITY_CHANGE: 'visibilitychange';
};
