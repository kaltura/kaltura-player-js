declare namespace KalturaPlayerTypes {
  export interface PlaylistItem {
    config: any;
    index: number;
    plugins: Record<string, any>;
    sources: any;
  }

  export interface Playlist {
    playNext: () => void;
    playPrev: () => void;
    playItem: (index: number) => void;
    reset: () => void;
    next: PlaylistItem | null;
    prev: PlaylistItem | null;
    countdown: {
      duration: number;
      showing: boolean;
    };
    current: PlaylistItem;
    id: string;
    items: Array<PlaylistItem>;
    metadata: {
      description: string;
      name: string;
    };
    poster: string;
    options: {
      autoContinue: boolean;
      loop: boolean;
    };
  }
}
