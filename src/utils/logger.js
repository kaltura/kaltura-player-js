//@flow
import * as JsLogger from 'js-logger';

const LOG_LEVEL: { [level: string]: Object } = {
  "DEBUG": JsLogger.DEBUG,
  "INFO": JsLogger.INFO,
  "TIME": JsLogger.TIME,
  "WARN": JsLogger.WARN,
  "ERROR": JsLogger.ERROR,
  "OFF": JsLogger.OFF
};

class Logger {
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

const LoggerFactory = new Logger({defaultLevel: JsLogger.DEBUG});

export default LoggerFactory;
export {LOG_LEVEL};
