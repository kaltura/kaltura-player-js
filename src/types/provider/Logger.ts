export type LogLevelObject = { value: number; name: string };
export type LogLevelType = { [level: string]: LogLevelObject };
export type loggerFunctionType = {
  VERSION: String;
  DEBUG: LogLevelObject;
  ERROR: LogLevelObject;
  INFO: LogLevelObject;
  OFF: LogLevelObject;
  TIME: LogLevelObject;
  TRACE: LogLevelObject;
  WARN: LogLevelObject;
  createDefaultHandler: () => void;
  debug: () => void;
  enabledFor: () => void;
  error: () => void;
  get: () => void;
  getLevel: () => void;
  info: () => void;
  log: () => void;
  setHandler: () => void;
  setLevel: () => void;
  time: () => void;
  timeEnd: () => void;
  trace: () => void;
  useDefaults: () => void;
  warn: () => void;
};

export interface Logger {
  getLogger: loggerFunctionType;
  LogLevel: LogLevelType;
}
