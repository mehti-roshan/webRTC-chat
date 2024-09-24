function createVideoElement(id) {
  const v = document.createElement("video");
  v.id = `remoteVideo-${id}`;
  v.playsInline = true;
  v.autoplay = true;
  return v;
}

function addVideoToDOM(video) {
  document.body.appendChild(video);
}

function addStreamToVideo(stream, video) {
  video.srcObject = stream;
}

function getVideoDOM(userId) {
  let remoteVideo = document.querySelector(`#remoteVideo-${userId}`);
  if (!remoteVideo) {
    remoteVideo = createVideoElement(userId)
    document.body.appendChild(remoteVideo);
  }
  return remoteVideo;
}
