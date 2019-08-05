// @flow
import getLogger from '../common/utils/logger';

const logger = getLogger('provider-manager');
const providers: Map<string, Function> = new Map();

const ProviderEnum = {
  OTT: 'OTT',
  OVP: 'OVP',
  NONE: 'NONE'
};
type ProviderEnumType = $Keys<typeof ProviderEnum>;

/**
 * register a provider with a name
 * @param {string} name - the provider name
 * @param {*} provider - the provider
 * @returns {boolean} - If the registration request succeeded
 */
function register(name: string, provider: any): boolean {
  if (!providers.has(name)) {
    logger.debug(`provider <${name}> has been registered successfully`);
    providers.set(name, provider);
    return true;
  }
  logger.debug(`provider <${name}> is already registered, do not register again`);
  return false;
}

/**
 * returns a provider by name
 * @param {string} name - the provider name
 * @returns {*} the provider
 */
function get(name: string): any {
  if (providers.has(name)) {
    return providers.get(name);
  } else {
    return null;
  }
}

/**
 * returns if a provider exist
 * @param {string} name - the provider name
 * @returns {boolean} - if the provider exists or not
 */
function exists(name: string): boolean {
  return providers.has(name);
}

export {register, get, exists, ProviderEnum};
export type {ProviderEnumType};
