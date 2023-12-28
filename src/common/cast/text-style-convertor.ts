import { TextStyle } from '@playkit-js/playkit-js';

declare global {
  interface Window {
    chrome?: {
      cast?: any;
    };
  }
}

class TextStyleConverter {
  public static toCastTextStyle(playerTextStyle: TextStyle): any {
    if (window.chrome && window.chrome.cast) {
      const textTrackStyle = new window.chrome.cast.media.TextTrackStyle();
      textTrackStyle.fontFamily = playerTextStyle.fontFamily;
      textTrackStyle.backgroundColor = TextStyleConverter.rgbToHex(playerTextStyle.backgroundColor);
      textTrackStyle.foregroundColor = TextStyleConverter.rgbToHex(playerTextStyle.fontColor);
      textTrackStyle.fontScale = Number.parseFloat(playerTextStyle.fontSize) / 100;
      return textTrackStyle;
    }
    return {};
  }

  public static toPlayerTextStyle(castTextStyle: any): TextStyle {
    const textStyle = new TextStyle();
    textStyle.fontFamily = castTextStyle.fontFamily;
    textStyle.fontSize = castTextStyle.fontScale * 100 + '%';
    textStyle.fontColor = TextStyleConverter.hexToRGB(castTextStyle.foregroundColor);
    textStyle.backgroundColor = TextStyleConverter.hexToRGB(castTextStyle.backgroundColor);
    return textStyle;
  }

  public static rgbToHex(rgb: Array<number>): string {
    let hex =
      '#' +
      // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ('0' + parseInt(rgb[0], 10).toString(16)).slice(-2) +
      // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
      // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2);
    if (rgb[3]) {
      let digit = rgb[3];
      digit = Math.round(digit * 100) / 100;
      const alpha = Math.round(digit * 255);
      hex += (alpha + 0x10000).toString(16).substr(-2).toUpperCase();
    } else {
      hex += 'FF';
    }
    return hex.toUpperCase();
  }

  public static hexToRGB(hex: string): [number, number, number] {
    const rgb: [number, number, number] = [] as unknown as [number, number, number];
    hex = hex.slice(1);
    const channels = hex.match(/.{1,2}/g);
    for (let i = 0; i < 3; i++) {
      const channel = channels && channels[i];
      if (channel) {
        // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
        // @ts-ignore
        rgb.push(parseInt(channel, 16));
      }
    }
    return rgb;
  }
}

export { TextStyleConverter };
