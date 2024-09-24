async function createPeerConnection(userId, socket) {
  const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
  const peer = new RTCPeerConnection(config);

  // Add local stream to the peer connection
  localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));

  // Handle remote stream
  peer.ontrack = (event) => {
    addStreamToVideo(event.streams[0], getVideoDOM(userId));
  };

  // Handle ICE candidates
  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("candidate", event.candidate);
    }
  };

  return peer;
}

async function handleOffer(offer, userId, socket) {
  const peer = await createPeerConnection(userId, socket);
  await peer.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  return answer;
}

async function handleAnswer(answer, userId) {
  const peer = peers[userId];
  if (peer) {
    await peer.setRemoteDescription(new RTCSessionDescription(answer));
  }
}

async function handleCandidate(candidate, userId) {
  const peer = peers[userId];
  if (peer) {
    console.log(candidate);
    await peer.addIceCandidate(new RTCIceCandidate(candidate));
  }
}
