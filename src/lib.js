
// const pId = 2222401;//Prodcution qa
const pId = 1091;//qa clear
// const pId = 198;//OTT
//const pId = 4171;//DRM qa


//production drm
let dataSource = [{
  label:"singtel",
  id:"1_f93tepsn",
  pId:pId
},{
  label:"bunny",
  id:"1_m1vpaory",
  pId:pId
}];
//qa - clear
dataSource =[{
  label:"disney",
  id:"0_wifqaipd",
  pId:pId
}, {
  label:"Multi_Audio_config_VOD_HLS",
  id:"0_ttfy4uu0",
  pId:pId
}];

/*//OTT
dataSource =[{
    label:"OTT1_Live",
    id:"255854",
    pId:pId
}, {
    label:"OTT2_UDRM_Dash",
    id:"460627",
    pId:pId
}]

//qa-drm
dataSource =[{
    label:"drm1",
    id:"0_2jiaa9tb",
    //id:"0_5277564k",
    //id:"0_wifqaipd",
    pId:pId
}, {
    label:"drm2",
    id:"0_7o8zceol",
    pId:pId
}]
*/


let OTTDataSource =[{
  label:"manish-sonakshi-s-hint-about-alia",
  id:567090
},
  {label:"kat-wants-alia-to-marry-firs",
    id:565863}];

dataSource = OTTDataSource;
let isOTT = false;
let isOffline;
let currentEntryId;
/*
var o = {
                targetId: "voot_player",
                provider: {
                    partnerId: 225,
                    uiConfId: 41726401,
                    env: {
                        serviceUrl: "https://rest-as.ott.kaltura.com/v4_4/api_v3"
                    }
                }
            }
              , s = KalturaPlayer.setup(o);
              */
let playerConfigOTT = {
  logLevel:"DEBUG",
  targetId: 'player',
  provider: {
    partnerId: 225,
    uiConfId: 41726401,
    env: {
      serviceUrl: "https://rest-as.ott.kaltura.com/v4_4/api_v3"
    }
  },
  player: {
    playback: {
      "preload": "none", // "auto"/"none"
      "autoplay": false, // false/true
      "muted": false, // false/true
      "playsinline": true,
      "allowMutedAutoPlay":true, // if autoPlay blocked by browser the video started muted
      "streamPriority": [
        {
          "engine": "html5",
          "format": "dash"
        }
      ]
    }
  }
};
let playerConfigOvp = {
  logLevel:"DEBUG",
  targetId: 'player',
  provider: {
    partnerId: pId,
    env: {
      cdnUrl: "https://qa-apache-php7.dev.kaltura.com",
      serviceUrl: "https://qa-apache-php7.dev.kaltura.com/api_v3"
    }
  },
  player: {
    playback: {
      "preload": "none", // "auto"/"none"
      "autoplay": false, // false/true
      "muted": false, // false/true
      "playsinline": true,
      "allowMutedAutoPlay":true, // if autoPlay blocked by browser the video started muted
      "streamPriority": [
        {
          "engine": "html5",
          "format": "dash"
        }
      ]
    }
  }
};

let kalturaPlayer;
let downloadManager = new KalturaPlayer.OfflineManager(playerConfigOTT);
downloadManager.addEventListener('error', function(e){
  $('#errorInput').val(JSON.stringify(e.payload));
})



window.addEventListener('offline', function(e) {onlineOfflineHandler(false)});
window.addEventListener('online', function(e) { onlineOfflineHandler(true) });
window.addEventListener('beforeunload',function(e){ pauseAll();});
$('.progress').hide();
onlineOfflineHandler(navigator.onLine);
fillData();

$("#download-btn").click(()=>{
  downloadManager.getDowindex-offlinenloadedMediaInfo(currentEntryId).then(result =>{
    if (result) {
      if (result.state == "paused") {
        downloadManager.resume(currentEntryId);
      }
      if (result.state == "ended") {
        alert("Entry already downloaded :-)")
      }
    } else {
      downloadManager.getMediaInfo({entryId: currentEntryId}).then( res => {
        downloadManager.download(currentEntryId);
      })
    }
  })

});

$("#pause-btn").click(()=>{
  downloadManager.pause(currentEntryId);
});

$("#resume-btn").click(()=>{
  downloadManager.resume(currentEntryId);
});

$("#delete-btn").click(()=>{
  downloadManager.remove(currentEntryId);
});

downloadManager.addEventListener("progress", event => {
  let dataIndex = 0;
  dataSource.forEach((data,index)=>{
    if (event.payload.detail.entryId == data.id){
      dataIndex = index;
    }
  })
  $('#progress'+dataIndex).show();
  $('#progress'+dataIndex).width(event.payload.detail.progress + "%");
  console.info("entry: ", event.payload.detail.entryId ,"progress", event.payload.detail.progress);
})

function pauseAll(){
  dataSource.forEach((item)=>{downloadManager.pause(item.id)});
}

function resumeAll(){
  dataSource.forEach((item)=>{downloadManager.resume(item.id)});
}

function fillData(){
  let dropDownItem = $("#dropdown-data-online");
  dataSource.forEach((item,index)=>{
    dropDownItem.append('<a class="dropdown-item" onclick="handleMovie('+index+')">'+item.label+'</a>');
  });
  let dropDownItemOffline = $("#dropdown-data-offline");

  downloadManager.getAllDownloads().then((items)=>{
    items.forEach((item,index)=>{
        dropDownItemOffline.append('<a class="dropdown-item" onclick="handleMovie('+index+')">'+item.name+'</a>');
      }
    )

  })

}

function handleMovie(playbackItemIndex){
  let playbackItem = dataSource[playbackItemIndex];
  currentEntryId = playbackItem.id;
  //playerConfig.provider.partnerId = playbackItem.pId;
  if ( !kalturaPlayer )  {
    kalturaPlayer = KalturaPlayer.setup(playerConfigOTT);
  }

  if (!downloadManager){
    downloadManager = new KalturaPlayer.OfflineManager(playerConfigOTT);
  }
  if (isOTT){
    kalturaPlayer.loadMedia({entryId: playbackItem.id},"Web New");

  } else {
    kalturaPlayer.loadMedia({entryId: playbackItem.id}, {});

  }

}

function onlineOfflineHandler(isOnline){
  if (isOnline) {
    //  resumeAll();
    $("#online-alert").show();
    $("#offline-alert").hide();
    $("#download-btn").show();
    $("#pause-btn").show();
    $("#resume-btn").show();
    $("#online-dd").show();
    $("#offline-dd").hide();



  } else {
    // pauseAll();
    $("#online-alert").hide();
    $("#offline-alert").show();
    $("#download-btn").hide();
    $("#pause-btn").hide();
    $("#resume-btn").hide();
    $("#online-dd").hide();
    $("#offline-dd").show();

  }
  isOffline = !isOnline;

}
