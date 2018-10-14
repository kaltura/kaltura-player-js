// @flow
const namespace = 'kaltura-player';

const CastEventType: {[event: string]: string} = {
  CAST_SESSION_START_FAILED: `${namespace}-castsessionstartfailed`,
  CAST_SESSION_STARTING: `${namespace}-castsessionstarting`,
  CAST_SESSION_STARTED: `${namespace}-castsessionstarted`,
  CAST_SESSION_ENDING: `${namespace}-castsessionending`,
  CAST_SESSION_ENDED: `${namespace}-castsessionended`,
  CAST_AVAILABLE: `${namespace}-castavailable`
};

export {CastEventType};
