# Advertisement layout management

With ad layout config you can create your own ad break timeline using your vast tags.  
Ad break can be set as pre, mid and post rolls and each ad break can contain a single vast tag or multiple tags, either as a pod, but also as a [Waterfall](#waterfalling)

## Table of Contents

- [Single Ad](#single-ad)
- [Ad Pod](#ad-pod)
- [Waterfalling](#waterfalling)
- [Ad Options](#ad-options)
- [Events](#events)
- [Play Ad Now](#play-ad-now)

### Single Ad

Here's a simple scheme contains 4 ad breaks: 1 pre-roll, 2 mid-rolls and 1 post-roll:

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
> Note: `position: 0` means pre-roll. `position: -1` means postroll.

### Ad Pod

An ad break may contain a list of ads, also referred to as ad pod.

> Ad Pod definition (from [IAB](https://www.iab.com/insights/digital-video-advertising-glossary)): An individual ad pod is a group of ads expected to play back-to-back in one commercial ad break similar to how consumers experience commercial ad breaks in broadcast television. An ad pod can be of varying lengths and can be inserted at any point in a stream of content (pre, mid, or post).

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
> The process is rather simple: if the first ad server doesn't have any ads to serve, a call to a second network is made etc.
> Meaning, if the first priority server did not "purchase" the impression, it would cascade down to the next server and to the next, until someone bought it.  
>  The same process is applied also if the ad server returned an error (or the client failed to communicate with it), and then it would cascade to the next server and to the next...

An application may want to set a fallback vast url, in case the primary ad request will failed the ad won't be skipped.  
This mechanism called _Waterfalling_, and it's configurable easily using the ad layout config.  
Here's a sample of a mid-roll with waterfalling:

```ecmascript 6
const config = {
  ...
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
> Hence, In this sample, while the playback will be played only one ad.  
> Note: There is no limit to the fallback url list.

### Ad Options

Each ad in the `ads` list gets the following options:

`url:Array<string>` - List of urls, each one specifies the ad tag url that is requested from the ad server.  
`response:Array<string>` - List of XMLs, each one specifies a VAST 2.0 document to be used as the ads response instead of making a request via an ad tag url.  
`bumper:boolean` - Specifies whether the is a bumper. `false` by default.

All the options above works together, means the application may use and mix them in the same `advertising` object.
Here's a sample:

```ecmascript 6
const config = {
 ...
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
     position: 60,
     ads: [{
         url: [MID_ROLL_2_VAST_URL]
       },{
         url: [MID_ROLL_3_VAST_URL_1, MID_ROLL_3_VAST_URL_2, ...]
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

### Events

In addition the current [ad events](./ads.md#ad-events) (`adbreakstart, adbreakend, adloaded` etc.) have added 2 new events:

`adwaterfalling` - Fired when an ad request failed and the player is trying to request the fallback.  
`adwaterfallingfailed` - Fired when the all fallback requests failed.

> Note. `aderror` not fired with `adwaterfalling` but fired with `adwaterfallingfailed`.

### Play Ad Now

All the above features are supported not only by `advertising` config, but also by `playAdNow` api which gets an ad pod as a parameter.  
So, the app may call whenever wants to play a ad pod.

```ecmascript 6
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
