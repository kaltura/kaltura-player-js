//@flow
import * as JsLogger from 'js-logger';

class LoggerFactory {
  constructor(options?: Object) {
    JsLogger.useDefaults(options || {});
  }

  getLogger(name?: string) {
    if (!name) {
      return JsLogger;
    }
    return JsLogger.get(name);
  }
}

const Logger = new LoggerFactory({defaultLevel: JsLogger.DEBUG});
const LOG_LEVEL: { [level: string]: Object } = {
  "DEBUG": JsLogger.DEBUG,
  "INFO": JsLogger.INFO,
  "TIME": JsLogger.TIME,
  "WARN": JsLogger.WARN,
  "ERROR": JsLogger.ERROR,
  "OFF": JsLogger.OFF
};

export default Logger;
export {LOG_LEVEL};
