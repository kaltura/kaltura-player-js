import { BasePlugin } from '../../../../../src';
import { KalturaPlayer as Player } from '../../../../../src/kaltura-player';

export default class ColorsPlugin extends BasePlugin {
  private _favouriteColor: string = '';
  private _size: number = 0;
  private _colors: Array<string> = [];

  public static defaultConfig: any = {
    size: 3,
    favouriteColor: 'green'
  };

  public static isValid(): boolean {
    return true;
  }

  constructor(name: string, player: Player, config: any) {
    super(name, player, config);
    this._configure();
    this._setup();
  }

  private _configure(): void {
    this._size = this.config.size;
    this._favouriteColor = this.config.favouriteColor;
    this.logger.info('_configure', this.config);
  }

  private _setup(): void {
    this._colors = [this._favouriteColor, 'blue', 'pink'];
    this.logger.info('_setup', this._colors);
  }

  public destroy(): void {
    this._colors = [];
    this._favouriteColor = '';
    this._size = 0;
    this.logger.info('destroy', this._colors, this._favouriteColor, this._size);
  }

  public reset(): void {
    this._colors = ['pink'];
    this._size = 1;
  }
}
