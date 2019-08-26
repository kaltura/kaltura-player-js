import {getThumbSlicesUrl} from 'utils/thumbs';

describe('getThumbSlicesUrl', function() {
  const fakeData = {
    sources: {
      poster: '//my-thumb-service.com/p/1/thumbnail/entry_id/2/version/3'
    },
    session: {
      ks: 'my-ks'
    }
  };

  const fakeUIConfig = {
    thumbsSlices: 200,
    thumbsWidth: 100
  };

  it('should get thumbnail slices url with default params', function() {
    getThumbSlicesUrl(fakeData).should.equals(`${fakeData.sources.poster}/width/164/vid_slices/100/ks/${fakeData.session.ks}`);
  });

  it('should get thumbnail slices url with the custom params', function() {
    getThumbSlicesUrl(fakeData, fakeUIConfig).should.equals(`${fakeData.sources.poster}/width/100/vid_slices/200/ks/${fakeData.session.ks}`);
  });

  it('should get empty thumbnail slices url for non string given', function() {
    fakeData.sources.poster = null;
    getThumbSlicesUrl(fakeData, fakeUIConfig).should.equals(``);
  });

  it('should get empty thumbnail slices url for non valid string given', function() {
    fakeData.sources.poster = '//my-thumb-service.com/p/1/entry_id/2/version/3';
    getThumbSlicesUrl(fakeData, fakeUIConfig).should.equals(``);
  });
});
