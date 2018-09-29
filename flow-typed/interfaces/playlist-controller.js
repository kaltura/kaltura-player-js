//@flow

declare interface IPlaylistController {
  playNext(): void;
  playPrev(): void;
  playItem(index: number): void;
  -items(): Array<KPPlaylistItem>
}
