export interface LogConfig {
  playerVersion?: boolean;
  level: string;
  handler?: (messages: any[], context: Object) => void;
  useDebugInfo?: boolean;
}
