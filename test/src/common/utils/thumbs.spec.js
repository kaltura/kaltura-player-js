import {getThumbSlicesUrl} from '../../../../src/common/utils/thumbs'

describe('getThumbSlicesUrl', function () {
  const fakeData = {
    sources: {
      poster: "//my-thumb-service.com/p/1/entry_id/2/version/3"
    },
    session: {
      ks: "my-ks"
    }
  };

  const fakeUIConfig = {
    thumbsSlices: 200,
    thumbsWidth: 100
  };

  it('should get thumbnail slices url with default params', function () {
    getThumbSlicesUrl(fakeData).should.equals(
      `${fakeData.sources.poster}/width/164/vid_slices/100/ks/${fakeData.session.ks}`
    );
  });

  it('should get thumbnail slices url with the custom params', function () {
    getThumbSlicesUrl(fakeData, fakeUIConfig).should.equals(
      `${fakeData.sources.poster}/width/100/vid_slices/200/ks/${fakeData.session.ks}`
    );
  });
});
