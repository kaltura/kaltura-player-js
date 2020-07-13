import {BasePlugin} from '../../../../../src/common/plugins/base-plugin';
import {KalturaPlayer as Player} from '../../../../../src/kaltura-player';

export default class ColorsPlugin extends BasePlugin {
  _favouriteColor: string = '';
  _size: number = 0;
  _colors: Array = [];

  static defaultConfig: Object = {
    size: 3,
    favouriteColor: 'green'
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
    this._favouriteColor = this.config.favouriteColor;
    this.logger.info('_configure', this.config);
  }

  _setup() {
    this._colors = [this._favouriteColor, 'blue', 'pink'];
    this.logger.info('_setup', this._colors);
  }

  destroy() {
    this._colors = [];
    this._favouriteColor = '';
    this._size = 0;
    this.logger.info('destroy', this._colors, this._favouriteColor, this._size);
  }

  reset() {
    this._colors = ['pink'];
    this._size = 1;
  }
}
