/**
 * Configuration structure of the player.
 * @returns {Object} - The configuration structure of the player.
 */
function getConfigStructure(): any {
  return {
    provider: {},
    ui: {},
    plugins: {},
    advertising: {
      adBreaks: []
    },
    sources: {},
    text: {
      enableCEA708Captions: true
    },
    playback: {
      preload: 'none',
      autoplay: false,
      muted: false,
      playbackRates: [2, 3, 4],
      streamPriority: [
        {
          engine: 'html5',
          format: 'hls'
        },
        {
          engine: 'html5',
          format: 'dash'
        },
        {
          engine: 'html5',
          format: 'progressive'
        }
      ]
    }
  };
}

/**
 * Creates a dom element.
 * @param {string} type - The element type.
 * @param {string} id - The element id.
 * @param {string} opt_parentId - Optional parent id.
 * @returns {HTMLDivElement}
 */
function createElement(type: string, id: string, opt_parentId?: string): HTMLElement {
  const element = document.createElement(type);
  element.id = id;
  if (!opt_parentId) {
    document.body.appendChild(element);
  } else {
    const parent = document.getElementById(opt_parentId);
    if (parent) {
      parent.appendChild(element);
    } else {
      document.body.appendChild(element);
    }
  }
  return element;
}

/**
 * Removes a dom element.
 * @param {string} id - The element id.
 * @returns {void}
 */
function removeElement(id): void {
  const element = document.getElementById(id);
  element.parentNode.removeChild(element);
}

/**
 * Removes all the video elements that created by the test from the document.
 * @returns {void}
 */
function removeVideoElementsFromTestPage(): void {
  const element = document.getElementsByTagName('video');
  for (let i = element.length - 1; i >= 0; i--) {
    element[i].parentNode.removeChild(element[i]);
  }
}

/**
 * Sets value of server config
 */
function setServerConfig(value): void {
  window.__kalturaplayerdata = value;
}

export {createElement, removeElement, removeVideoElementsFromTestPage, getConfigStructure, setServerConfig};
