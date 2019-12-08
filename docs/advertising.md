# Ad Layout and Waterfalling

Ad layout is a new config option lets the application to sets a scheme of vasts (instead of VMAP) with waterfalling mechanism.

## Table of Contents

- [Basic Usage](#basic-usage)
  - [Single Ad](#single-ad)

### Basic Usage

#### Single Ad

Here's a simple scheme contains 4 ad breaks - 1 pre-roll, 2 mid-rolls and 1 post-roll:

```ecmascript 6
const config = {
  ...
  advertising: {
    adBreaks: [{
      position: 0,
      ads: [{
          url: [PRE_ROLL_VAST_URL]
        }]
      }, {
      position: 15,
      ads: [{
          url: [MID_ROLL_VAST_URL]
        }]
      }, {
      position: 60,
      ads: [{
          url: [MID_ROLL_VAST_URL]
        }]
      }, {
      position: -1,
      ads: [{
          url: [POST_ROLL_VAST_URL]
        }]
      }
    ]
  }
  ...
}
const kalturaPlayer = KalturaPlayer.setup(config);
```

> Note: `position: 0` means pre-roll. `position: -1` means postroll.

> In this sample while the playback will be played 4 ads (Unless ad failures).

#### Ad Pod

An ad break can contain not only a single ad, but also a list of ads (aka ad pod).

```ecmascript 6
const config = {
  ...
  advertising: {
    adBreaks: [{
      position: 0,
      ads: [{
          url: [PRE_ROLL_1_VAST_URL]
        },{
          url: [PRE_ROLL_2_VAST_URL]
        }]
      }, {
      position: 15,
      ads: [{
          url: [MID_ROLL_1_VAST_URL]
        },{
          url: [MID_ROLL_2_VAST_URL]
        }]
      }, {
      position: 60,
      ads: [{
          url: [MID_ROLL_3_VAST_URL]
        },{
          url: [MID_ROLL_4_VAST_URL]
        }]
      }, {
      position: -1,
      ads: [{
          url: [POST_ROLL_1_VAST_URL]
        },{
          url: [POST_ROLL_2_VAST_URL]
        }]
      }
    ]
  }
  ...
}
const kalturaPlayer = KalturaPlayer.setup(config);
```

> In this sample while the playback will be played 8 ads.

### Waterfalling

An application may want to set a fallback vast url, in case the primary ad request will failed the ad won't be skipped.
This mechanism called _Waterfalling_, and it's configurable easily using the ad layout config.
Here's the sample above with waterfalling:

```ecmascript 6
const config = {
  ...
  advertising: {
    adBreaks: [{
      position: 0,
      ads: [{
          url: [PRE_ROLL_1.1_VAST_URL, PRE_ROLL_1.2_VAST_URL, ...]
        },{
          url: [PRE_ROLL_2.1_VAST_URL, PRE_ROLL_2.2_VAST_URL, ...]
        }]
      }, {
      position: 15,
      ads: [{
          url: [MID_ROLL_1.1_VAST_URL, MID_ROLL_1.2_VAST_URL, ...]
        },{
          url: [MID_ROLL_2.1_VAST_URL, MID_ROLL_2.2_VAST_URL, ...]
        }]
      }, {
      position: 60,
      ads: [{
          url: [MID_ROLL_3.1_VAST_URL, MID_ROLL_3.2_VAST_URL, ...]
        },{
          url: [MID_ROLL_4.1_VAST_URL, MID_ROLL_4.2_VAST_URL, ...]
        }]
      }, {
      position: -1,
      ads: [{
          url: [POST_ROLL_1.1_VAST_URL, POST_ROLL_1.2_VAST_URL, ...]
        },{
          url: [POST_ROLL_2.1_VAST_URL, POST_ROLL_2.2_VAST_URL, ...]
        }]
      }
    ]
  }
  ...
}
const kalturaPlayer = KalturaPlayer.setup(config);
```

> Important: A fallback url (e.g. PRE_ROLL_1.2_VAST_URL) will be used only if the previous request (PRE_ROLL_1.1_VAST_UR) is failed.
> Hence, In this sample while the playback will still be played 8 ads.

> Note: There is no limit to the fallback url list.
