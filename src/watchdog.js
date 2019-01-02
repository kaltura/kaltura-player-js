var stream;

function gotMedia(mediaStream) {
  stream = mediaStream;
  const vid = document.getElementById('watcher-video');
  vid.srcObject = mediaStream;
}

function startVideo() {
  navigator.mediaDevices
    .getUserMedia({video: true})
    .then(gotMedia)
    .catch(function(error) {
      console.error('getUserMedia() error:', error);
    });
}

function takePhoto1() {
  if (stream) {
    $('#age-text').text('DETECTING YOUR AGE...');
    $('#age-box').show();
    $('#age-box').addClass('animated fadeInUp');
    const mediaStreamTrack = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(mediaStreamTrack);
    const img = document.getElementById('watcher-img');
    img.style.display = 'block';
    $(img)
      .show()
      .addClass('animated bounceIn');
    imageCapture
      .takePhoto()
      .then(function(blob) {
        var xhr = new XMLHttpRequest();
        XMLHttpRequest.responseType = 'json';
        xhr.onload = function() {
          try {
            const data = JSON.parse(this.responseText);
            $('#age-loader').hide();
            $('#age-text').text('AGE DETECTED:');
            const age = data[0].faceAttributes.age;
            $('#age-value').show();
            $('#age-value').text(age);
            $('#age-value').addClass('animated jello');
            if (age > 18) {
              $('#free-viewing-message').show();
              $('#free-viewing-message').addClass('animated fadeInRight');
            } else {
              $('#res-viewing-message').show();
              $('#res-viewing-message').addClass('animated fadeInRight');
            }
          } catch (e) {}
        };
        xhr.open(
          'POST',
          'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=false&returnFaceLandmarks=false&returnFaceAttributes=age'
        );
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('responseType', 'application/json');
        xhr.setRequestHeader('Ocp-Apim-Subscription-Key', 'c0fd94ac752a47aba24c5332e3cbdff9');
        xhr.send(blob);
        img.src = URL.createObjectURL(blob);
        img.onload = function() {
          URL.revokeObjectURL(this.src);
          mediaStreamTrack.stop();
        };
      })
      .catch(function(error) {
        console.error('takePhoto() error:', error);
      });
  }
}
