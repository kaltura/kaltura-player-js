// @flow
const ValidationErrorType = {
  INITIAL_CONFIG_REQUIRED: 'Must provide initial providers config',
  PARTNER_ID_REQUIRED: 'Must provide partner id',
  TARGET_ID_REQUIRED: 'Must provide target id',
  DOM_ELEMENT_WITH_TARGET_ID_REQUIRED: 'Must provide DOM element with id of: ',
  TARGET_ID_ALREADY_USED: 'The target id provided is already in use. Id: '
};

export {ValidationErrorType};
