// @flow
import {TextStyle} from 'playkit-js';

class TextStyleConverter {
  static toCastTextStyle(playerTextStyle: TextStyle): Object {
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

  static toPlayerTextStyle(castTextStyle: Object): TextStyle {
    const textStyle = new TextStyle();
    textStyle.fontFamily = castTextStyle.fontFamily;
    textStyle.fontSize = castTextStyle.fontScale * 100 + '%';
    textStyle.fontColor = TextStyleConverter.hexToRGB(castTextStyle.foregroundColor);
    textStyle.backgroundColor = TextStyleConverter.hexToRGB(castTextStyle.backgroundColor);
    return textStyle;
  }

  static rgbToHex(rgb: Array<number>): string {
    let hex =
      '#' +
      ('0' + parseInt(rgb[0], 10).toString(16)).slice(-2) +
      ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
      ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2);
    if (rgb[3]) {
      let digit = rgb[3];
      digit = Math.round(digit * 100) / 100;
      const alpha = Math.round(digit * 255);
      hex += (alpha + 0x10000)
        .toString(16)
        .substr(-2)
        .toUpperCase();
    } else {
      hex += 'FF';
    }
    return hex.toUpperCase();
  }

  static hexToRGB(hex: string): Array<number> {
    const rgb = [];
    hex = hex.slice(1);
    const channels = hex.match(/.{1,2}/g);
    for (let i = 0; i < 3; i++) {
      const channel = channels && channels[i];
      if (channel) {
        rgb.push(parseInt(channel, 16));
      }
    }
    return rgb;
  }
}

export {TextStyleConverter};
