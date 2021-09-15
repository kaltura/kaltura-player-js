import {expect} from 'chai';
import SourcesConfig from '../../configs/sources';
import {getConfigStructure} from '../../utils/test-utils';
import {KalturaPlayer as Player} from '../../../../src/kaltura-player';
import {CuePointManager} from '../../../../src/common/cuepoint/cuepoint-manager';

describe('CuePointManager', () => {
  let config, player, sandbox;

  before(() => {
    config = getConfigStructure();
  });

  beforeEach(() => {
    player = new Player(config);
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    player.destroy();
    sandbox.restore();
  });

  it('should get cue-point manager', function () {
    expect(player.cuePointManager).instanceOf(CuePointManager);
  });

  it('should create and add text-track', function () {
    player.setMedia({sources: SourcesConfig.Mp4});
    expect(player.cuePointManager._textTrack).to.eql(null);
    player.cuePointManager.addCuePoints([]);
    expect(player.cuePointManager._textTrack).instanceOf(TextTrack);
  });

  it('should add/get/remove/clear-all cue points', function () {
    const cuePoints = [
      {
        id: 'test-id-1',
        startTime: 1,
        endTime: 6
      },
      {
        id: 'test-id-2',
        startTime: 6,
        endTime: 10
      },
      {
        id: 'test-id-3',
        startTime: 10,
        endTime: 15
      }
    ];
    player.setMedia({sources: SourcesConfig.Mp4});
    expect(player.cuePointManager.getAllCuePoints().length).eql(0);
    player.cuePointManager.addCuePoints(cuePoints);
    expect(player.cuePointManager.getAllCuePoints().length).eql(3);
    const cuePoint = player.cuePointManager.getCuePointById('test-id-1');
    expect(cuePoint.id).to.eql('test-id-1');
    player.cuePointManager.removeCuePoint(cuePoint);
    expect(player.cuePointManager.getAllCuePoints().length).eql(2);
    player.cuePointManager.clearAllCuePoints();
    expect(player.cuePointManager.getAllCuePoints().length).eql(0);
  });
});
