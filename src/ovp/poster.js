/**
 * Add poster with player dimensions to thumbnail API call
 * @param {Object} metadata - metadata container
 * @param {number} width - player width in px
 * @param {number} height - player height in px
 * @returns {void}
 */
export function addKalturaPoster(metadata: Object, width: number, height: number): void {
  if (metadata.poster) {
    metadata.poster = `${metadata.poster}/height/${height}/width/${width}`;
  }
}
