import {addKalturaPoster} from '../../../src/ovp/poster';
import * as TestUtils from '../utils/test-utils';
import {setup} from '../../../src/setup';
import {Provider} from 'playkit-js-providers';
import {Images} from '../mock-data/images';

const targetId = 'player-placeholder_ovp/poster.spec';

describe('addKalturaPoster', function () {
  it('should append width and height to kaltura poster', function () {
    const mediaSources = {poster: '/p/1091/thumbnail/entry_id/0_wifqaipd/2'};
    const playerSources = {poster: '/p/1091/thumbnail/entry_id/0_wifqaipd/2'};
    addKalturaPoster(playerSources, mediaSources, {width: 640, height: 360});
    playerSources.poster.should.equal('/p/1091/thumbnail/entry_id/0_wifqaipd/2/height/360/width/640');
    mediaSources.poster.should.equal(playerSources.poster);
  });

  it('should not append width and height to non kaltura poster', function () {
    const mediaSources = {poster: 'https//my/kaltura/poster'};
    const playerSources = {poster: 'https//my/kaltura/poster'};
    addKalturaPoster(playerSources, mediaSources, {width: 640, height: 360});
    playerSources.poster.should.equal('https//my/kaltura/poster');
    mediaSources.poster.should.equal(playerSources.poster);
  });

  it('should not append width and height to configured kaltura poster', function () {
    const mediaSources = {poster: 'https//my/kaltura/poster'};
    const playerSources = {poster: 'https//my/non/kaltura/poster'};
    addKalturaPoster(playerSources, mediaSources, {width: 640, height: 360});
    playerSources.poster.should.equal('https//my/non/kaltura/poster');
    mediaSources.poster.should.equal(playerSources.poster);
  });

  it('should change poster of mediaSources to string', function () {
    const mediaSources = {
      poster: [
        {url: 'https//my/kaltura/poster', width: 0, height: 0},
        {url: 'https//my/kaltura/poster', width: 0, height: 0}
      ]
    };
    const playerSources = {poster: 'https//my/kaltura/poster'};
    addKalturaPoster(playerSources, mediaSources, {width: 640, height: 360});
    mediaSources.poster.should.equal(playerSources.poster);
  });

  describe('Poster Integration', function () {
    let config, kalturaPlayer, sandbox, provider;
    const myCustomPosterUrl = Images.POSTER;
    const entryId = '0_wifqaipd';
    const alterEntryId = '0_4ktof5po';
    const partnerId = 1091;
    const env = {
      cdnUrl: 'https://qa-apache-php7.dev.kaltura.com/',
      serviceUrl: 'https://qa-apache-php7.dev.kaltura.com/api_v3'
    };

    before(function () {
      TestUtils.createElement('DIV', targetId);
    });

    beforeEach(function () {
      sandbox = sinon.createSandbox();
      provider = new Provider({
        partnerId: partnerId,
        env: env
      });
      config = {
        targetId: targetId,
        provider: {
          partnerId: partnerId,
          env: env
        },
        sources: {}
      };
    });

    afterEach(function () {
      sandbox.restore();
      kalturaPlayer.destroy();
      provider = null;
      TestUtils.removeVideoElementsFromTestPage();
    });

    after(function () {
      TestUtils.removeElement(targetId);
    });

    it('should choose configured poster', function (done) {
      config.sources.poster = myCustomPosterUrl;
      kalturaPlayer = setup(config);
      kalturaPlayer.loadMedia({entryId: entryId}).then(() => {
        kalturaPlayer.sources.poster.should.equal(myCustomPosterUrl);
        done();
      });
    });

    it('should choose backend poster', function (done) {
      kalturaPlayer = setup(config);
      provider.getMediaConfig({entryId: entryId}).then(mediaConfig => {
        kalturaPlayer.loadMedia({entryId: entryId}).then(() => {
          kalturaPlayer.sources.poster.should.have.string(mediaConfig.sources.poster);
          done();
        });
      });
    });

    it('should choose backend poster on change media', function (done) {
      kalturaPlayer = setup(config);
      provider.getMediaConfig({entryId: entryId}).then(mediaConfig => {
        kalturaPlayer.loadMedia({entryId: entryId}).then(() => {
          kalturaPlayer.config.sources.poster.should.have.string(mediaConfig.sources.poster);
          provider.getMediaConfig({entryId: alterEntryId}).then(alterMediaConfig => {
            kalturaPlayer.loadMedia({entryId: alterEntryId}).then(() => {
              kalturaPlayer.sources.poster.should.have.string(alterMediaConfig.sources.poster);
              done();
            });
          });
        });
      });
    });

    it('should choose configured poster on change media', function (done) {
      kalturaPlayer = setup(config);
      provider.getMediaConfig({entryId: entryId}).then(mediaConfig => {
        kalturaPlayer.loadMedia({entryId: entryId}).then(() => {
          kalturaPlayer.sources.poster.should.have.string(mediaConfig.sources.poster);
          kalturaPlayer.reset();
          kalturaPlayer.configure({
            sources: {
              poster: myCustomPosterUrl
            }
          });
          kalturaPlayer.loadMedia({entryId: alterEntryId}).then(() => {
            kalturaPlayer.sources.poster.should.equal(myCustomPosterUrl);
            done();
          });
        });
      });
    });
  });
});
