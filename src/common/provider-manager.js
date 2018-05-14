// @flow
const providers = new Map();

/**
 * register a provider with a name
 * @param {string} name - the provider name
 * @param {*} provider - the provider
 * @returns {void}
 */
function register(name: string, provider: any): void {
  if (providers.has(name)) {
//do nothing
  } else {
    providers.set(name, provider);
  }
}

/**
 * returns a provider by name
 * @param {string} name - the provider name
 * @returns {*} the provider
 */
function get(name: string): any{
  if (providers.has(name)){
    return providers.get(name);
  } else {
    return null;
  }
}

function list(){
  return providers.keys();
}

/**
 * returns if a provider exist
 * @param {string} name - the provider name
 * @returns {boolean} - if the provider exists or not
 */
function exists(name: string): boolean{
  return providers.has(name);
}

export {register, get, exists, list}
