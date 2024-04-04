import { Error } from '@playkit-js/playkit-js';

const isBackEndError = (error: Error): boolean => error.category === 2;
const isBlockAction = (error: Error): boolean => error.code === 2001;
const isMediaNotReady = (error: Error): boolean => error.code === 2002;
const isGeolocationRestricted = (error: Error): boolean => error.data?.messages && error.data?.messages[0].code === 'COUNTRY_RESTRICTED';
const isSessionRestricted = (error: Error): boolean => error.data?.messages && error.data?.messages[0].code === 'SESSION_RESTRICTED';

const isSessionRestrictedError = (error: Error): boolean => isBackEndError(error) && isBlockAction(error) && isSessionRestricted(error);
const isGeolocationError = (error: Error): boolean => isBackEndError(error) && isBlockAction(error) && isGeolocationRestricted(error);
const isMediaNotReadyError = (error: Error): boolean => isBackEndError(error) && isMediaNotReady(error);

const conditionsToErrors = [
  [isSessionRestrictedError, Error.Category.MEDIA_UNAVAILABLE],
  [isGeolocationError, Error.Category.GEO_LOCATION],
  [isMediaNotReadyError, Error.Category.MEDIA_NOT_READY]
];

function getErrorCategory(error: Error): number {
  return conditionsToErrors.find((condition) => condition[0](error) === true) ? [1] : Error.Category.PLAYER;
}

export default getErrorCategory;
