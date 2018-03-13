import {addKalturaPoster} from '../../../src/ovp/poster-and-thumbs'

describe('addKalturaPoster', function () {
  it('should append width and height to kaltura poster', function () {
    let metadata = {poster: 'https//my/kaltura/poster'};
    addKalturaPoster(metadata, 640, 360);
    metadata.poster.should.equal('https//my/kaltura/poster/height/360/width/640');
  });
});
