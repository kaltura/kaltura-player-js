import {addKalturaPoster} from '../../../src/ott/poster';

describe('addKalturaPoster', function () {
  it('should change poster of mediaSources to string', function () {
    const mediaSources = {
      poster: [
        {url: 'https//my/kaltura/poster', width: 0, height: 0},
        {url: 'https//my/kaltura/poster', width: 0, height: 0}
      ]
    };
    const playerSources = {poster: 'https//my/kaltura/poster'};
    addKalturaPoster(playerSources, mediaSources, {width: 640, height: 360});
    mediaSources.poster.should.have.string(playerSources.poster);
  });

  it('should align poster of mediaSources with poster of playerSources', function () {
    const mediaSources = {poster: 'https//my/kaltura/poster'};
    const playerSources = {
      poster: [
        {url: 'https//my/kaltura/poster', width: 0, height: 0},
        {url: 'https//my/kaltura/poster', width: 0, height: 0}
      ]
    };
    addKalturaPoster(playerSources, mediaSources, {width: 640, height: 360});
    mediaSources.poster.should.equal(playerSources.poster);
  });
});
