import { TextStyle } from '@playkit-js/playkit-js';
declare global {
  interface Window {
    chrome?: {
      cast?: any;
    };
  }
}
declare class TextStyleConverter {
  static toCastTextStyle(playerTextStyle: TextStyle): Object;
  static toPlayerTextStyle(castTextStyle: any): TextStyle;
  static rgbToHex(rgb: Array<number>): string;
  static hexToRGB(hex: string): Array<number>;
}
export { TextStyleConverter };
//# sourceMappingURL=text-style-convertor.d.ts.map
