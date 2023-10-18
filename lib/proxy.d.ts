import { KalturaPlayer } from './kaltura-player';
/**
 * get all instantiated players
 * @returns {KalturaPlayers} - map of player ids and their respective instantiated player
 */
declare function getPlayers(): {};
/**
 * get a player instance by id
 * @param {string} id - the player ID
 * @returns {KalturaPlayer | null} - the player if found by the supplied ID or null if key doesn't exist
 */
declare function getPlayer(id: string): any;
declare const getPlayerProxy: (options: any) => KalturaPlayer;
export { getPlayerProxy, getPlayer, getPlayers };
//# sourceMappingURL=proxy.d.ts.map
