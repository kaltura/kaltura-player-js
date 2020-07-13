import {BasePlugin} from '../../../../../src/common/plugins/base-plugin';
import {KalturaPlayer as Player} from '../../../../../src/kaltura-player';

export default class NumbersPlugin extends BasePlugin {
  _firstCellValue: number = 0;
  _lastCellValue: number = 0;
  _size: number = 0;
  _numbers: Array = [];

  static defaultConfig: Object = {
    size: 10,
    firstCellValue: 4,
    lastCellValue: 6
  };

  static isValid(): boolean {
    return true;
  }

  constructor(name: string, player: Player, config: Object) {
    super(name, player, config);
    this._configure();
    this._setup();
  }

  _configure() {
    this._size = this.config.size;
    this._firstCellValue = this.config.firstCellValue;
    this._lastCellValue = this.config.lastCellValue;
    this.logger.info('_configure', this.config);
  }

  _setup() {
    this._numbers[0] = this._firstCellValue;
    for (let i = 1; i < this._size - 1; i++) {
      this._numbers[i] = (i * i) / 2;
    }
    this._numbers[this._size - 1] = this._lastCellValue;
    this.logger.info('_setup', this._numbers);
  }

  destroy() {
    this._numbers = [];
    this._firstCellValue = 0;
    this._lastCellValue = 0;
    this._size = 0;
    this.logger.info('destroy', this._numbers, this._firstCellValue, this._lastCellValue, this._size);
  }

  reset() {
    this._numbers = [1, 2, 3];
    this._size = 3;
  }
}
