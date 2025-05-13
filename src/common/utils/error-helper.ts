import { Error } from '@playkit-js/playkit-js';

const isBackEndError = (error: Error): boolean => error.category === 2;
const isBlockAction = (error: Error): boolean => error.code === 2001;
const isMediaNotReady = (error: Error): boolean => error.code === 2002;
const isScheduledRestrictedCode = (error: Error): boolean => error.code === 2003;
const isGeolocationRestricted = (error: Error): boolean => error.data?.messages && error.data?.messages[0].code === 'COUNTRY_RESTRICTED';
const isSessionRestricted = (error: Error): boolean => error.data?.messages && error.data?.messages[0].code === 'SESSION_RESTRICTED';
const isIPRestricted = (error: Error): boolean => error.data?.messages && error.data?.messages[0].code === 'IP_RESTRICTED';
const isSitedRestricted = (error: Error): boolean => error.data?.messages && error.data?.messages[0].code === 'SITE_RESTRICTED';
const isScheduledRestricted = (error: Error): boolean => error.data?.messages && error.data?.messages[0].code === 'SCHEDULED_RESTRICTED';

const isSessionRestrictedError = (error: Error): boolean => isBackEndError(error) && isBlockAction(error) && isSessionRestricted(error);
const isGeolocationError = (error: Error): boolean => isBackEndError(error) && isBlockAction(error) && isGeolocationRestricted(error);
const isMediaNotReadyError = (error: Error): boolean => isBackEndError(error) && isMediaNotReady(error);
const isIPRestrictedError = (error: Error): boolean => isBackEndError(error) && isBlockAction(error) && isIPRestricted(error);
const isSitedRestrictedError = (error: Error): boolean => isBackEndError(error) && isBlockAction(error) && isSitedRestricted(error);
const isScheduledRestrictedError = (error: Error): boolean =>
  isBackEndError(error) && isScheduledRestrictedCode(error) && isScheduledRestricted(error);
const isAccessControlRestrictedError = (error: Error): boolean => {
  return (
    isBackEndError(error) &&
    isBlockAction(error) &&
    !isGeolocationRestricted(error) &&
    !isSessionRestricted(error) &&
    !isIPRestricted(error) &&
    !isSitedRestricted(error) &&
    !isScheduledRestricted(error)
  );
};

const conditionsToErrors: any[] = [
  [isSessionRestrictedError, Error.Category.MEDIA_UNAVAILABLE],
  [isGeolocationError, Error.Category.GEO_LOCATION],
  [isMediaNotReadyError, Error.Category.MEDIA_NOT_READY],
  [isIPRestrictedError, Error.Category.IP_RESTRICTED],
  [isScheduledRestrictedError, Error.Category.SCHEDULED_RESTRICTED],
  [isSitedRestrictedError, Error.Category.SITE_RESTRICTED],
  [isAccessControlRestrictedError, Error.Category.ACCESS_CONTROL_BLOCKED]
];

function getErrorCategory(error: Error): number {
  const [, errorCategory] = conditionsToErrors.find((errorCondition) => errorCondition[0](error)) || [];
  return errorCategory || Error.Category.PLAYER;
}

export default getErrorCategory;
