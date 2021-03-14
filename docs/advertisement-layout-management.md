# Advertisement layout management

With ad layout config you can create your own ad break timeline using your vast tags.
Ad break can be set as pre, mid and post rolls and each ad break can contain a single vast tag or multiple tags, either as a pod, but also as a [Waterfall](#waterfalling).

> **Important:** [IMA plugin](https://github.com/kaltura/playkit-js-ima) must be active to enable this feature.

## Table of Contents

- [Single Ad](#single-ad)
- [Ad Pod](#ad-pod)
- [Waterfalling](#waterfalling)
- [Ad Break Options](#ad-break-options)
- [Ad Options](#ad-options)
- [Play Ads After Time](#play-ads-after-time)
- [Events](#events)
- [Play Ad Now](#play-ad-now)
- [Play Ad Now with Prebid](#play-ad-now-with-prebid)
- [Seekbar Cue Points](#seekbar-cue-points)
- [Prebid](#prebid)

### Single Ad

Here's a simple scheme sample which contains 4 ad breaks: 1 pre-roll, 2 mid-rolls and 1 post-roll:

```js
const config = {
  ...
  plugins: {
    ima: {}
  },
  advertising: {
    adBreaks: [{
      position: 0,
      ads: [{
          url: [PRE_ROLL_VAST_URL]
        }]
      }, {
      position: 15,
      ads: [{
          url: [MID_ROLL_1_VAST_URL]
        }]
      }, {
      position: 60,
      ads: [{
          url: [MID_ROLL_2_VAST_URL]
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

> In this sample, the player will try to request and play 4 ads.
> Note: `position: 0` means pre-roll. `position: -1` means post-roll.

### Ad Pod

An ad break may contain a list of ads, also referred to as ad pod.

> Ad Pod definition (from [IAB](https://www.iab.com/insights/digital-video-advertising-glossary)): An individual ad pod is a group of ads expected to play back-to-back in one commercial ad break similar to how consumers experience commercial ad breaks in broadcast television. An ad pod can be of varying lengths and can be inserted at any point in a stream of content (pre, mid, or post).

Ad pod sample:

```js
const config = {
  ...
  plugins: {
    ima: {}
  },
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
      }
    ]
  }
  ...
}
const kalturaPlayer = KalturaPlayer.setup(config);
```

> In this sample, the player will try to request and play 4 ads in 2 ad breaks, each one contains 2 ads consecutively.

### Waterfalling

> Waterfalling ("daisy chain") is a process used by publishers selling ads in order to get a better fill-rate.
> This process can be implemented on the ad server itself, but it can also be implemented on the client - which is what we did.
> The process is rather simple: if the first ad server doesn't have any ads to serve, a call to a second server is made etc.
> Meaning, if the first priority server did not "purchase" the impression, it would cascade down to the next server and to the next, until someone bought it.
> The same process is applied also if the ad server returned an error (or the client failed to communicate with it), and then it would cascade to the next server and to the next...

An application may want to set a fallback vast url, so in case the primary ad request had failed, the ad won't be skipped.
This mechanism called _Waterfalling_, is configurable easily using the ad layout config.
Here's a sample of a mid-roll with waterfalling:

```js
const config = {
  ...
  plugins: {
    ima: {}
  },
  advertising: {
    adBreaks: [{
      position: 15,
      ads: [{
          url: [MID_ROLL_VAST_URL_1, MID_ROLL_VAST_URL_2, ...]
        }]
      }
    ]
  }
  ...
}
const kalturaPlayer = KalturaPlayer.setup(config);
```

> Important: A fallback url (e.g. MID_ROLL_VAST_URL_2) will be only used if the previous request (MID_ROLL_VAST_URL_1) is failed.
> Hence, In this sample, only one ad will be played.
> Note: There is no limit to the fallback url list.

### Ad Break Options

Each ad break in the `adBreaks` list gets the following options:

`position: number` - The position, in seconds, to show the ad break.
`percentage?: number` - Alternative parameter to `position`. The position, in percentage of the media length, to show the ad break (optional).
`every?: number` - Alternative parameter to `position`. Play ad break every X seconds (optional).
`ads: Array<Object>` - An array of ads to play ([Ad pod](#ad-pod)).

> Note. `position`, `percentage` and `every` are several options to configure the ad break position.
> Only one should be provided. If none will be provided, the ad break will be ignored.
> If more than one will be provided, only one configuration will be considered, by the following priority:
>
> 1.  `position` 2. `percentage` 3. `every`.

### Ad Options

Each ad in the `ads` list gets the following options:

`url:Array<string>` - List of urls, each one specifies the ad tag url that is requested from the ad server.
`response:Array<string>` - List of XMLs, each one specifies a VAST 2.0 document to be used as the ads response instead of making a request via an ad tag url.
`bumper:boolean` - Specifies whether this is a bumper. `false` by default.
`prebid:KPAdPrebidConfig` - Specifies whether this is a prebid ad and add the relevant config for prebid request.

All the options above work together, that means the application may use and mix them in the same `advertising` object.
Here's a sample:

```js
const config = {
  ...
  plugins: {
    ima: {}
  },
  advertising: {
    adBreaks: [{
     position: 0,
     ads: [{
         url: [PRE_ROLL_VAST_URL_1, PRE_ROLL_VAST_URL_2, ...]
       },{
         bumper: true,
         response: [BUMPER_VAST_XML_1, BUMPER_VAST_XML_2, ...]
       }]
     }, {
     position: 15,
     ads: [{
         response: [MID_ROLL_1_XML]
       }]
     }, {
     percentage: 50,
     ads: [{
         url: [MID_ROLL_2_VAST_URL]
       },{
         url: [MID_ROLL_3_VAST_URL_1, MID_ROLL_3_VAST_URL_2, ...]
       }]
     }, {
     every: 300,
     ads: [{
         response: [MID_ROLL_4_VAST_URL]
       }]
     }, {
     position: -1,
     ads: [{
         url: [POST_ROLL_VAST_URL_1, POST_ROLL_VAST_URL_2, POST_ROLL_VAST_URL_3, ...]
       }]
     }
    ]
  }
 ...
}
const kalturaPlayer = KalturaPlayer.setup(config);
```

### Play Ads After Time

An application may want to configure the player to play ads only from a specific time.
This can be achieved by `playAdsAfterTime` parameter. For example:

```js
const config = {
  ...
  plugins: {
    ima: {}
  },
  advertising: {
    playAdsAfterTime: 10,
    adBreaks: [{
      position: 0,
      ads: [{
          url: [PRE_ROLL_VAST_URL]
        }]
      }, {
      position: 15,
      ads: [{
          url: [MID_ROLL_1_VAST_URL]
        }]
      }
    ]
  }
  ...
}
const kalturaPlayer = KalturaPlayer.setup(config);
```

In this sample, the player will skip the pre-roll, and will play the mid-roll only.

> Note: This setting is strictly after - e.g. setting playAdsAfterTime to 15 will cause the player to ignore an ad break scheduled to play at 15s.

This option can be used also when `playback.startTime` is set, which by default causes the player to skip the ads scheduled before the start time.
Although, An application may want to force the player to play these ads. This can be achieved also by `playAdsAfterTime` parameter. For example:

```js
const config = {
  ...
  playback: {
    startTime: 60
  },
  plugins: {
    ima: {}
  },
  advertising: {
    playAdsAfterTime: -1,
    adBreaks: [{
      position: 0,
      ads: [{
          url: [PRE_ROLL_VAST_URL]
        }]
      }
    ]
  }
  ...
}
const kalturaPlayer = KalturaPlayer.setup(config);
```

In this sample, the player will play the pre-roll, and only after that will start the playback from the 60's second.

### Events

In addition to the current [ad events](./ads.md#ad-events) (`adbreakstart, adbreakend, adloaded` etc.) we have added 2 new events:

`adwaterfalling` - Fired when an ad request failed and the player is trying to request the fallback.
`adwaterfallingfailed` - Fired when the all fallback requests failed.

> Note: `aderror` will not be fired with `adwaterfalling` but with `adwaterfallingfailed`.

### Play Ad Now

All the above features are supported not only by `advertising` config, but also by `playAdNow` api which gets an ad pod as a parameter.
The app may call it whenever it wants to play an ad pod.

```js
const config = {
  ...
  plugins: {
    ima: {}
  }
}
const kalturaPlayer = KalturaPlayer.setup(config);
kalturaPlayer.play();
... // playback
kalturaPlayer.ads.playAdNow(
  [
    {
      url: [MID_ROLL_1_VAST_URL_1, MID_ROLL_1_VAST_URL_2, ...]
    }, {
      url: [MID_ROLL_2_VAST_URL]
    },
  ]);
```

### Play Ad Now with Prebid

All the above features are supported not only by `advertising` config, but also by `playAdNow` api which gets an ad pod as a parameter.
The app may call it whenever it wants to play an ad pod with prebid.

```js
const config = {
  ...
  plugins: {
    ima: {}
  },
  advertising: {
    prebid:{
      libUrl: 'https://acdn.adnxs.com/prebid/not-for-prod/3/prebid.js',
    }
  }
}
const kalturaPlayer = KalturaPlayer.setup(config);
kalturaPlayer.play();
... // playback
kalturaPlayer.ads.playAdNow(
  [
    {
      url: [MID_ROLL_1_VAST_URL_1, MID_ROLL_1_VAST_URL_2, ...],
      prebid: {
        adUnit: {
          //configuration for bidders
        },
        params: {
          //params for dfp in prebid
        },
        options: {
          //configuration for prebid cache url and etc.
        }
      }
    }
  ]);
```

### Seekbar Cue Points

To display cue points on the seekbar to indicates the ad break positions use `showAdBreakCuePoint` option, as following:

```js
const config = {
  ...
  plugins: {
    ima: {}
  },
  advertising: {
    showAdBreakCuePoint: true,
    adBreaks: [{
      position: 60,
      ads: [{
          url: [MID_ROLL_VAST_URL]
        }]
      }
    ]
  }
  ...
}
```

To customize the cue points style use `adBreakCuePointStyle` option. for example:

```js
const config = {
  ...
  plugins: {
    ima: {}
  },
  advertising: {
    showAdBreakCuePoint: true,
    adBreakCuePointStyle: {
     marker: {
       width: 10,
       color: 'rgb(255, 0, 0)'
      }
    },
    adBreaks: [{
      position: 60,
      ads: [{
          url: [MID_ROLL_VAST_URL]
        }]
      }
    ]
  }
  ...
}
```

### Prebid

For prebid configuration there are two places to config:

1. top level config - set the configuration for prebid- libUrl/timeout
2. ad level config - configuration for adUnit/params/options and timeout can configure per an ad or for all ads

Prebid can use as pre-roll/mid-roll/post-roll return list of ads and use as waterfall
Here is sample for midroll position 60 and url provided will be the fallback for prebid configuration.

```js
const config = {
  ...
  plugins: {
    ima: {}
  },
  advertising: {
    prebid:{
      libUrl: 'https://acdn.adnxs.com/prebid/not-for-prod/3/prebid.js',
    }
    adBreaks: [{
      position: 60,
      ads: [{
          url: [MID_ROLL_VAST_URL],
          prebid: {
            adUnit: {
              //configuration for bidders
            },
            params: {
              //params for dfp in prebid
            },
            options: {
              //configuration for prebid cache url and etc.
            }
          }
        }]
      }
    ]
  }
  ...
}
```

All style options are listed [here](https://github.com/kaltura/playkit-js-timeline/blob/main/docs/types.md#cuepointoptionsobject).
