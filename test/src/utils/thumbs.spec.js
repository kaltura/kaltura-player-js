import {getThumbSlicesUrl} from '../../../src/utils/thumbs'

describe('getThumbSlicesUrl', function () {
  const fakeData = {
    metadata: {
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
      `${fakeData.metadata.poster}/width/164/vid_slices/100/ks/${fakeData.session.ks}`
    );
  });

  it('should get thumbnail slices url with the custom params', function () {
    getThumbSlicesUrl(fakeData, fakeUIConfig).should.equals(
      `${fakeData.metadata.poster}/width/100/vid_slices/200/ks/${fakeData.session.ks}`
    );
  });
});
