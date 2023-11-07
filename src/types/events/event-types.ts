import {VISIBILITY_CHANGE} from '../../common/utils/viewability-manager';

export type KPEventTypes = {
  // TODO - PKEventTypes
  // Core: PKEventTypes,
  Core: any;
  UI: { [event: string]: string };
  Cast: { [event: string]: string };
  Playlist: { [event: string]: string };
  VISIBILITY_CHANGE: string;
};
