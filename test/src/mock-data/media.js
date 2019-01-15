const MediaConfig = {
  '0_wifqaipd': {
    session: {
      isAnonymous: true,
      partnerId: 1091,
      uiConfId: 15215933,
      ks: 'OGViNDhkZGI4ZTM1ODAzYWVhYTk0OTZlMzcwMmZmZjUzMjZkNGFkMnwxMDkxOzEwOTE7MTU0NDY5MTMwODswOzE1NDQ2MDQ5MDguNTg4NDswO3ZpZXc6Kix3aWRnZXQ6MTs7'
    },
    sources: {
      hls: [
        {
          id: '0_wifqaipd_861,applehttp',
          url:
            'http://qa-apache-php7.dev.kaltura.com/p/1091/sp/109100/playManifest/entryId/0_wifqaipd/protocol/http/format/applehttp/flavorIds/0_h65mfj7f,0_3flmvnwc,0_m131krws,0_5407xm9j,0_xcrwyk2n/a.m3u8?uiConfId=15215933',
          mimetype: 'application/x-mpegURL'
        }
      ],
      dash: [
        {
          id: '0_wifqaipd_911,mpegdash',
          url:
            'http://qa-apache-php7.dev.kaltura.com/p/1091/sp/109100/playManifest/entryId/0_wifqaipd/protocol/http/format/mpegdash/flavorIds/0_m131krws,0_5407xm9j,0_xcrwyk2n/a.mpd?uiConfId=15215933',
          mimetype: 'application/dash+xml'
        }
      ],
      progressive: [
        {
          id: '0_h65mfj7f261,url',
          url:
            'http://qa-apache-php7.dev.kaltura.com/p/1091/sp/109100/playManifest/entryId/0_wifqaipd/protocol/http/format/url/flavorIds/0_h65mfj7f/a.mp4?uiConfId=15215933',
          mimetype: 'video/mp4',
          bandwidth: 480256,
          width: 480,
          height: 272,
          label: 'Undefined'
        },
        {
          id: '0_3flmvnwc261,url',
          url:
            'http://qa-apache-php7.dev.kaltura.com/p/1091/sp/109100/playManifest/entryId/0_wifqaipd/protocol/http/format/url/flavorIds/0_3flmvnwc/a.mp4?uiConfId=15215933',
          mimetype: 'video/mp4',
          bandwidth: 686080,
          width: 640,
          height: 360,
          label: 'Undefined'
        },
        {
          id: '0_m131krws261,url',
          url:
            'http://qa-apache-php7.dev.kaltura.com/p/1091/sp/109100/playManifest/entryId/0_wifqaipd/protocol/http/format/url/flavorIds/0_m131krws/a.mp4?uiConfId=15215933',
          mimetype: 'video/mp4',
          bandwidth: 987136,
          width: 640,
          height: 360,
          label: 'Undefined'
        },
        {
          id: '0_5407xm9j261,url',
          url:
            'http://qa-apache-php7.dev.kaltura.com/p/1091/sp/109100/playManifest/entryId/0_wifqaipd/protocol/http/format/url/flavorIds/0_5407xm9j/a.mp4?uiConfId=15215933',
          mimetype: 'video/mp4',
          bandwidth: 1667072,
          width: 1280,
          height: 720,
          label: 'Undefined'
        },
        {
          id: '0_xcrwyk2n261,url',
          url:
            'http://qa-apache-php7.dev.kaltura.com/p/1091/sp/109100/playManifest/entryId/0_wifqaipd/protocol/http/format/url/flavorIds/0_xcrwyk2n/a.mp4?uiConfId=15215933',
          mimetype: 'video/mp4',
          bandwidth: 2691072,
          width: 1280,
          height: 720,
          label: 'Undefined'
        }
      ],
      id: '0_wifqaipd',
      duration: 741,
      type: 'Vod',
      poster: 'http://cdntesting.qa.mkaltura.com/p/1091/sp/109100/thumbnail/entry_id/0_wifqaipd/version/100042',
      dvr: false,
      vr: null,
      metadata: {
        name: 'MPEG Dash with MultiAudio New Transcoding',
        description: '',
        tags: '',
        MediaType: 'Movie',
        WatchPermissionRule: 'Parrent Allowed'
      }
    },
    plugins: {}
  },
  Youtube: {
    session: {
      isAnonymous: true,
      partnerId: 1234,
      uiConfId: 1234567,
      ks: 'ABCDEFGHIJKLMNOP'
    },
    sources: {
      hls: [],
      dash: [],
      progressive: [
        {
          id: '1111',
          url:
            'http://qa-apache-php7.dev.kaltura.com/p/1234/sp/123400/playManifest/entryId/1111/protocol/http/format/url/flavorIds/1111/a.mp4?uiConfId=15215933',
          mimetype: 'video/youtube'
        }
      ],
      id: '0_wifqaipd',
      duration: 741,
      type: 'Vod',
      poster: 'http://cdntesting.qa.mkaltura.com/p/1234/sp/123400/thumbnail/entry_id/1111/version/100042',
      dvr: false,
      vr: null,
      metadata: {
        name: 'MPEG Dash with MultiAudio New Transcoding',
        description: '',
        tags: '',
        MediaType: 'Movie',
        WatchPermissionRule: 'Parrent Allowed'
      }
    },
    plugins: {}
  }
};

export {MediaConfig};
