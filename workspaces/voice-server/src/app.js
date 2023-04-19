import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mediasoup from "mediasoup";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const httpServer = createServer(app);

httpServer.listen(4000, () => {
  console.log("Server listening on port 4000");
});

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

const worker = await mediasoup.createWorker()

const mediaCodecs = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: {
      "x-google-start-bitrate": 1000,
    },
  },
];

const rooms = [];
const peers = [];

io.on("connection", async (socket) => {
  console.log("Client connected");

  socket.on("connected", async (data) => {
    console.log("connected");
    console.log(rooms)
    const room = rooms.find((room) => room.id === data.channelId);
    if (!room) {
      socket.emit("init-room-participants", []);
      return;
    }
    const roomParticipants = room.peers.map(x => x.info);
    socket.emit("init-room-participants", roomParticipants);
    socket.join(data.channelId);
  });

  socket.on("join-room", async (data, callback) => {
    let roomIndex = rooms.findIndex((room) => room.id === data.channelId);
    if (roomIndex === -1) {
      const room = {
        id: data.channelId,
        router: await worker.createRouter({ mediaCodecs: mediaCodecs }),
        peers: [],
      };
      rooms.push(room);
      roomIndex = rooms.findIndex((room) => room.id === data.channelId);
    }
    let peerIndex = rooms[roomIndex].peers.findIndex((peer) => peer.id === socket.id);
    if (peerIndex == -1) {
      const peer = {
        id: data.developerId,
        roomId: data.channelId,
        socketId: socket.id,
        transports: [],
        producer: null,
        producerTransport: null,
        consumers: [],
        info: {
          id: data.developerId,
          name: data.developerName,
          avatar: data.developerAvatar,
          githubName: data.developerGithubName,
        }
      };
      rooms[roomIndex].peers.push(peer);
      callback({ rtpCapabilities: rooms[roomIndex].router.rtpCapabilities });
    }
    socket.join(data.channelId);
  });

  socket.on("createWebRtcTransport", async (data, callback) => {
    const roomIndex = rooms.findIndex((room) => room.id === data.channelId);
    if (roomIndex === -1) {
      socket.emit("error", "Room not found");
      return;
    }
    const peerIndex = rooms[roomIndex].peers.findIndex(
      (peer) => peer.id === data.developerId
    );
    if (peerIndex === -1) {
      socket.emit("error", "Room not found");
      return;
    }
    const transport = await createWebRtcTransport(rooms[roomIndex].router, socket);
    if (data.sender) {
      callback({
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      });
      rooms[roomIndex].peers[peerIndex].producerTransport = transport;
    } else {
      callback({
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      });
      rooms[roomIndex].peers[peerIndex].transports.push(transport);
    }
  });

  socket.on("transportConnect", async (data) => {
    const roomIndex = rooms.findIndex((room) => room.id === data.channelId);
    if (roomIndex === -1) {
      socket.emit("error", "Room not found");
      return;
    }
    const peerIndex = rooms[roomIndex].peers.findIndex(
      (peer) => peer.id === data.developerId
    );
    if (peerIndex === -1) {
      socket.emit("error", "Room not found");
      return;
    }
    if (data.sender) {
      await rooms[roomIndex].peers[peerIndex].producerTransport.connect({
        dtlsParameters: data.dtlsParameters,
      });
    } else {
      console.log(data)
      const consumerTransport = rooms[roomIndex].peers[
        peerIndex
      ].transports.find((transport) => transport.id === data.id);
      await consumerTransport.connect({ dtlsParameters: data.dtlsParameters });
    }
  });

  socket.on("produce", async (data, callback) => {
    const { kind, rtpParameters, channelId } = data;

    const roomIndex = rooms.findIndex((room) => room.id === channelId);
    if (roomIndex === -1) {
      socket.emit("error", "Something went wrong! Please refresh and try again.");
      return;
    }
    const peerIndex = rooms[roomIndex].peers.findIndex(
      (peer) => peer.id === data.developerId
    );
    if (peerIndex === -1) {
      socket.emit("error", "Something went wrong! Please refresh and try again.");
      return;
    }

    const producerTransport =
      rooms[roomIndex].peers[peerIndex].producerTransport;
    if (!producerTransport) {
      socket.emit("error", "Something went wrong! Please refresh and try again.");
      return;
    }

    const producer = await producerTransport.produce({
      kind,
      rtpParameters,
    });
    rooms[roomIndex].peers[peerIndex].producer = producer;

    io.to(channelId).emit("new-producer", {
      producerId: producer.id,
      peerId: data.developerId,
      info: rooms[roomIndex].peers.map(x => x.info),
    });

    producer.on("transportclose", () => {
      console.log("producer transportclose");
      producer.close();
    });

    callback({ id: producer.id });
  });

  socket.on("consume", async (data, callback) => {
    console.log("consume");
    const roomIndex = rooms.findIndex((room) => room.id === data.channelId);
    if (roomIndex === -1) {
      socket.emit("error", "Something went wrong! Please refresh and try again.");
      return;
    }
    const peerIndex = rooms[roomIndex].peers.findIndex(
      (peer) => peer.id === data.developerId
    );
    if (peerIndex === -1) {
      socket.emit("error", "Something went wrong! Please refresh and try again.");
      return;
    }

    const producerPeerIndex = rooms[roomIndex].peers.findIndex(
      (x) => x.id == data.producerPeerId
    );
    const router = rooms[roomIndex].router;
    const consumerTransport = rooms[roomIndex].peers[peerIndex].transports.find(
      (x) => x.id === data.consumerTransportId
    );
    const producer = rooms[roomIndex].peers[producerPeerIndex].producer;
    if (
      !producer ||
      !consumerTransport ||
      !router.canConsume({
        producerId: producer.id,
        rtpCapabilities: data.rtpCapabilities,
      })
    ) {
      socket.emit("error", "Something went wrong! Please refresh and try again.");
      return;
    }
    const consumer = await consumerTransport.consume({
      producerId: producer.id,
      rtpCapabilities: data.rtpCapabilities,
      paused: true,
    });

    consumer.on("transportclose", () => {
      console.log("transport close from consumer");
    });

    consumer.on("producerclose", () => {
      console.log("producer of consumer closed");
    });

    rooms[roomIndex].peers[peerIndex].consumers.push(consumer);
    callback({
      id: consumer.id,
      producerId: producer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
    });
  });

  socket.on("resume", async (data) => {
    console.log("resume");
    const roomIndex = rooms.findIndex((room) => room.id === data.channelId);
    if (roomIndex === -1) {
      socket.emit("error", "Something went wrong! Please refresh and try again.");
      return;
    }
    const peerIndex = rooms[roomIndex].peers.findIndex(
      (peer) => peer.id === data.developerId
    );
    if (peerIndex === -1) {
      socket.emit("error", "Something went wrong! Please refresh and try again.");
      return;
    }

    const consumer = rooms[roomIndex].peers[peerIndex].consumers.find(
      (x) => x.id === data.consumerId
    );
    if (!consumer) {
      socket.emit("error", "Something went wrong! Please refresh and try again.");
      return;
    }
    await consumer.resume();
  });

  socket.on("getProducers", async (data, callback) => {
    const roomIndex = rooms.findIndex((room) => room.id === data.channelId);
    if (roomIndex === -1) {
      socket.emit("error", "Something went wrong! Please refresh and try again.");
      return;
    }
    const peers = rooms[roomIndex].peers.filter((peer) => peer.id != data.developerId);
    if (!peers) {
      socket.emit("error", "Something went wrong! Please refresh and try again.");
      return;
    }
    const producerInfo = peers.map((peer) => ({
      peerId: peer.id,
      producerId: peer.producer.id,
    }));
    callback(producerInfo);
  });

  socket.on("leave-room", (data) => {
    console.log("leave-room")
    const roomIndex = rooms.findIndex((room) => room.id === data.channelId);
    if (roomIndex === -1) {
      socket.emit("error", "Something went wrong! Please refresh and try again.");
      return;
    }
    const peerIndex = rooms[roomIndex].peers.findIndex(
      (peer) => peer.id === data.developerId
    );
    if (peerIndex === -1) {
      socket.emit("error", "Something went wrong! Please refresh and try again.");
      return;
    }

    rooms[roomIndex].peers[peerIndex].producer?.close();
    rooms[roomIndex].peers[peerIndex].producerTransport?.close();
    rooms[roomIndex].peers[peerIndex].transports.forEach((transport) =>
      transport.close()
    );
    rooms[roomIndex].peers[peerIndex].consumers.forEach((consumer) =>
      consumer.close()
    );
    rooms[roomIndex].peers.splice(peerIndex, 1);

    io.to(rooms[roomIndex].id).emit("producer-leave", {
      info: rooms[roomIndex].peers.map(x => x.info),
    });
  });

  socket.on("disconnect", () => {
    console.log("peer disconnected");
    const roomIndex = rooms.findIndex(x => x.peers.map(x => x.socketId).includes(socket.id));
    if (roomIndex === -1) {
      return;
    }

    const peersToBeRemoved = rooms[roomIndex].peers.filter(x => x.socketId === socket.id);
    if (peersToBeRemoved.length === 0) {
      return;
    }

    peersToBeRemoved.forEach(peer => {
      const peerIndex = rooms[roomIndex].peers.findIndex(x => x.id === peer.id);
      if (peerIndex === -1) {
        return;
      } else {
        rooms[roomIndex].peers[peerIndex].producer?.close();
        rooms[roomIndex].peers[peerIndex].producerTransport?.close();
        rooms[roomIndex].peers[peerIndex].transports.forEach((transport) =>
          transport.close()
        );
        rooms[roomIndex].peers[peerIndex].consumers.forEach((consumer) =>
          consumer.close()
        );
        rooms[roomIndex].peers.splice(peerIndex, 1);
      }
    });
      
    socket.broadcast.to(rooms[roomIndex].id).emit("producer-leave", {
      info: rooms[roomIndex].peers.map(x => x.info),
    });

  });
});

const createWebRtcTransport = async (router, socket) => {
  try {
    const webRtcTransport_options = {
      listenIps: [
        {
          ip: "0.0.0.0",
          announcedIp: process.env.ANNOUNCEDIP,
        },
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    };

    let transport = await router.createWebRtcTransport(webRtcTransport_options);
    console.log(`transport created: ${transport.id}`);

    transport.on("dtlsstatechange", (dtlsState) => {
      if (dtlsState === "closed") {
        transport.close();
      }
    });

    transport.on("close", () => {
      console.log("transport closed");
    });

    return transport;
  } catch (error) {
    socket.emit("error", "Something went wrong! Please refresh and try again.");
    return;
  }
};
