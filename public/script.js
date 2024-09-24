const peers = {};
let localStream;

navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    localStream = stream;
    addStreamToVideo(localStream, document.querySelector("#localVideo"));
    setupSocket();
  });
