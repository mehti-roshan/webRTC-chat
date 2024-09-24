function setupSocket() {
  const socket = io();
  socket.emit("join-room", ROOM);
  socket.on("user-joined", async (userId) => {
    console.log(`User ${userId} joined`);

    const peer = await createPeerConnection(userId, socket);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    peers[userId] = peer;
    socket.emit("offer", { offer, to: userId });
  });

  socket.on("user-left", (userId) => {
    console.log(`User ${userId} left`);
    if (peers[userId]) {
      peers[userId].close();
      delete peers[userId];
    }

    const vid = getVideoDOM(userId);
    if (vid) {
      vid.remove();
    }
  });

  socket.on("offer", async ({ offer, from }) => {
    console.log(`Recieved offer from ${from}`);
    const answer = await handleOffer(offer, from, socket);
    socket.emit("answer", { answer, to: from });
  });

  socket.on("answer", async ({ answer, from }) => {
    console.log(`Recieved answer from ${from}`);
    await handleAnswer(answer, from);
  });

  socket.on("candidate", async ({ candidate, from }) => {
    console.log(`Recieved ICE candidate from ${from}`);
    await handleCandidate(candidate, from);
  });
}