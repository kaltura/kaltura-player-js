export interface MediaSourceOptionsObject {
  forceRedirectExternalStreams: boolean;
  redirectExternalStreamsHandler: () => void | undefined;
  redirectExternalStreamsTimeout: number | undefined;
}
