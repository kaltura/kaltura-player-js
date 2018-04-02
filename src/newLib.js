/* Player configs */
let playback = {
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
      },
      {
        "engine": "html5",
        "format": "hls"
      }
    ]
  }
};

let playerConfigOvpQA = {
  logLevel:"DEBUG",
  targetId: 'player',
  provider: {
    partnerId: 1091,
    env: {
      cdnUrl: "https://qa-apache-php7.dev.kaltura.com",
      serviceUrl: "https://qa-apache-php7.dev.kaltura.com/api_v3"
    }
  },
  player: playback
};

let playerConfigOvpProd = {
  logLevel:"DEBUG",
  targetId: 'player',
  provider: {
    partnerId: 2222401,
    env: {
      cdnUrl: "https://cdnapisec.kaltura.com",
      serviceUrl: "https://cdnapisec.kaltura.com/api_v3"
    }
  },
  player: playback
};

let playerConfigOTT = {
  logLevel:"DEBUG",
  targetId: 'player',
  provider: {
    partnerId: 198,
    env: {
      serviceUrl: "http://api-preprod.ott.kaltura.com/v4_7/api_v3/"
    }
  },
  player: playback
};

let playerConfigV18 = {
  logLevel:"DEBUG",
  targetId: 'player',
  provider: {
    partnerId: 225,
    env: {
      serviceUrl: "https://rest-as.ott.kaltura.com/v4_4/api_v3"
    }
  },
  player: playback
};


const Env = [
  {
    id:1,fileType:null, playerConfig:playerConfigOvpProd,label:"Production DRM",
    Pid:2222401,
    playerEmbed:"http://www.kaltura.com/p/1740481/sp/174048100/embedPlaykitJs/uiconf_id/42129681/partner_id/1740481",
    dataSource:[{
      label:"singtel",
      id:"1_f93tepsn"
    },{
      label:"bunny",
      id:"1_m1vpaory"
    }]
  },
  {
    id:2,
    label:"QA Clear",
    playerConfig: playerConfigOvpQA,
    playerEmbed:"//qa-apache-php7.dev.kaltura.com/p/1091/sp/109100/embedPlaykitJs/uiconf_id/15212531/partner_id/1091",
    Pid:1091,
    dataSource :[{
      label:"disney",
      id:"0_wifqaipd"
    }, {
      label:"Multi_Audio_config_VOD_HLS",
      id:"0_ttfy4uu0"
    }]
  },
  {
    id:3,
    label:"QA DRM",
    playerEmbed:"//qa-apache-php7.dev.kaltura.com/p/1091/sp/109100/embedPlaykitJs/uiconf_id/15212531/partner_id/1091",
    playerConfig: playerConfigOvpQA,
    Pid:4171,
    dataSource :[{
      label:"test",
      id:"0_5277564k"
    }, {
      label:"drm2",
      id:"0_7o8zceol"
    }]
  },
  {
    id:4,
    label:"OTT",
    playerEmbed:"//qa-apache-php7.dev.kaltura.com/p/1091/sp/109100/embedPlaykitJs/uiconf_id/15212878/partner_id/1091",
    playerConfig: playerConfigOTT,
    Pid:1091,
    dataSource :[{
      label:"OTT1_HLS_VOD_long",
      id:"259153"
    }, {
      label:"OTT1_HLS_VOD",
      id:"258459"
    }, {
      label:"OTT2_UDRM_Dash",
      id:"460627"
    }]
  },

  {
    id:5,
    label:"OTT V18 PROD",
    playerEmbed:"http://www.kaltura.com/p/1740481/sp/174048100/embedPlaykitJs/uiconf_id/42129631/partner_id/1740481",
    playerConfig: playerConfigV18,
    Pid:225,
    dataSource :[{
      label:"manish-sonakshi-s-hint-about-alia",
      id:567090
    },
      {label:"kat-wants-alia-to-marry-firs",
        id:565863}]
  },

];


let OTTDataSource =[{
  label:"manish-sonakshi-s-hint-about-alia",
  id:567090
},
  {label:"kat-wants-alia-to-marry-firs",
    id:565863}];

//dataSource = OTTDataSource;
let isOTT = false;
let isOffline;
let currentEntryId;

let kalturaPlayer,downloadManager;
let EnvIndex = 0;
EnvIndex = getParameterByName("env",window.location.href);
if (EnvIndex === undefined || EnvIndex === null) EnvIndex = 0;
let currentEnv = Env.filter(item => item.id == EnvIndex)[0];
$.getScript(currentEnv.playerEmbed,()=>{
  $("#env-label").html(currentEnv.label);
  downloadManager = new KalturaPlayer.OfflineManager(currentEnv.playerConfig);
  downloadManager.addEventListener('error', function(e){
    $('#errorInput').val(JSON.stringify(e.payload));
  })

  window.addEventListener('offline', function(e) {onlineOfflineHandler(false)});
  window.addEventListener('online', function(e) { onlineOfflineHandler(true) });
  window.addEventListener('beforeunload',function(e){ pauseAll();});
  $('.progress').hide();
  onlineOfflineHandler(navigator.onLine);
  fillData();

  downloadManager.addEventListener("progress", event => {
    let dataIndex = 0;
    currentEnv.dataSource.forEach((data,index)=>{
      if (event.payload.detail.entryId == data.id){
        dataIndex = index;
      }
    })
    $('#progress'+dataIndex).show();
    $('#progress'+dataIndex).width(event.payload.detail.progress + "%");
    console.info("entry: ", event.payload.detail.entryId ,"progress", event.payload.detail.progress);
  })
});


$("#download-btn").click(()=>{
  downloadManager.getDownloadedMediaInfo(currentEntryId).then(result =>{
    if (result) {
      if (result.state == "paused") {
        downloadManager.resume(currentEntryId);
      }
      if (result.state == "ended") {
        alert("Entry already downloaded :-)")
      }
    } else {
      downloadManager.getMediaInfo({entryId: currentEntryId}).then( res => {
        downloadManager.download(currentEntryId, {language: "en", bitrate: 5952342});
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



function pauseAll(){
  currentEnv.dataSource.forEach((item)=>{downloadManager.pause(item.id)})
}

function resumeAll(){
  currentEnv.dataSource.forEach((item)=>{downloadManager.resume(item.id)})
}

function fillData(){
  let dropDownItem = $("#dropdown-data-online");
  dropDownItem.empty();
  currentEnv.dataSource.forEach((item,index)=>{
    dropDownItem.append('<a class="dropdown-item" onclick="handleMovie(\''+item.id+'\')">'+item.label+'</a>');
  });
  let dropDownItemOffline = $("#dropdown-data-offline");
  dropDownItemOffline.empty();
  downloadManager.getAllDownloads().then((items)=>{
    items.forEach((item,index)=>{
        dropDownItemOffline.append('<a class="dropdown-item" onclick="handleMovie(\''+item.id+'\')">'+item.name+'</a>');
      }
    )

  })

  let envDD = $("#env-dd");
  envDD.empty();
  Env.forEach((item,index) => {
    envDD.append('<a class="dropdown-item" onclick="handleEnv(\''+item.id+'\')">'+item.label+'</a>');
  })

}

function handleEnv(id){
  window.location.href =  window.location.href.replace(/\?env=.*/ig,"") + "?env=" +id;
}

function handleMovie(entryId){
  let playbackItem = currentEnv.dataSource.filter(item => item.id == entryId)[0];
  currentEntryId = playbackItem.id;
  //playerConfig.provider.partnerId = playbackItem.pId;
  if ( !kalturaPlayer )  {
    kalturaPlayer = KalturaPlayer.setup(currentEnv.playerConfig);
  }

  if (!downloadManager){
    downloadManager = new KalturaPlayer.OfflineManager(currentEnv.playerConfig);
  }
  if (currentEnv.fileType){
    kalturaPlayer.loadMedia({entryId: playbackItem.id},currentEnv.fileType);

  } else {
    kalturaPlayer.loadMedia({entryId: playbackItem.id});

  }

}

function onlineOfflineHandler(isOnline){
  if (isOnline) {
    //  resumeAll();
    fillData();
    $("#online-alert").show();
    $("#offline-alert").hide();
    $("#download-btn").show();
    $("#pause-btn").show();
    $("#resume-btn").show();
    $("#online-dd").show();
    $("#offline-dd").hide();



  } else {
    pauseAll();
    fillData();
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

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
