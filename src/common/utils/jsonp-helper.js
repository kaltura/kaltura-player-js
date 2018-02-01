// @flow
import {Env} from 'playkit-js'

/**
 * jsonp callback function, returns the direct manifest uri
 * @param {Object} data - the json object that returns from the server
 * @param {string} uri - original request uri
 * @returns {string} returns the direct uri
 */
function getDirectManfiestUri(data: Object, uri: string): string {
  const getParsedUri = uri => {
    const parser = document.createElement('a');
    parser.href = uri;
    return {
      'hostname': parser.hostname,
      'uri': uri
    }
  };

  const uriHost = getParsedUri(uri).hostname;
  const flavorUriHost = getParsedUri(data.flavors[0].url).hostname
  if (data.flavors.length === 1 && uriHost !== flavorUriHost) {
    return data.flavors[0].url;
  } else {
    return uri;
  }
}

/**
 * returns if we should use our jsonp http plugin
 * @param {Object} config - configuration relevant to jsonp
 * @returns {boolean} should or not use jsonp requests on manifests
 */
function shouldUseJsonp(config: Object): boolean{
  if ((config && config.useJsonp) || Env.browser.name.includes("IE") || Env.browser.name.includes("Edge")){
    return true;
  }
  return false;
}

/**
 * add jsonp configuration to the general config
 * @param {Object} config - configuration relevant to jsonp
 * @returns {void}
 */
function configureJsonp(config: Object): void{
  config.playback = config.playback || {};
  config.playback.options = config.playback.options || {};
  config.playback.options.html5 = config.playback.options.html5 || {};
  if (shouldUseJsonp(config.playback.options.html5.dash)){
    config.playback.options.html5.dash = config.playback.options.html5.dash || {};
    config.playback.options.html5.dash.useJsonp = true;
    config.playback.options.html5.dash.callback = getDirectManfiestUri;
  }
  if (shouldUseJsonp(config.playback.options.html5.hls)){
    config.playback.options.html5.hls = config.playback.options.html5.hls || {};
    config.playback.options.html5.hls.useJsonp = true;
    config.playback.options.html5.hls.callback = getDirectManfiestUri;
  }
}

export {configureJsonp}
