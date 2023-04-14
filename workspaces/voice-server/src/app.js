import express from "express";
import { createServer, request } from "http";
import { Server } from "socket.io";
import cookie from "cookie";
import axios from "axios";

import { createWorker } from "./createWorker.js";
import { getVoiceChatParticipants } from "./redis.js"
import { createWebRtcTransport } from "./createTransport.js";

const app = express();

const httpServer = createServer(app);

httpServer.listen(4000, () => {
  console.log("listening on port 4000");
});

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: "*",
  },
});

const worker = await createWorker();
const routers = {}

// define the tyeps of media our SFU will take.
// we are only defining audio but this could be expanded to video also in the future
const mediaCodecs = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
  },
];

let producertransport
let consumertransport
let producer
let consumer

io.on("connection", async (socket) => {
  if (socket.request.headers.cookie) {
    const cookies = cookie.parse(socket.request.headers.cookie);
    if (!cookies["Authorization"]) {
      socket.emit("error", "No authorisation");
      return;
    }
    try {
      const userDataReq = await axios.post(
        "http://localhost:8000/auth/verify-token",
        { token: cookies["Authorization"] }
      );
      const userData = userDataReq.data;
      // actual section where we are defining socket behaviour and responses
      if (userData) {

        socket.on("connected", async (chatId) => {
          const info = await getVoiceChatParticipants(chatId)
          socket.emit("unopened-voice-chat-info", info)
          console.log("user connected")
        });

        socket.on("get-rtp-capabilities", async (chatId) => {
          let router
          if (routers[chatId]) {
            router = routers[chatId]
          }
          else {
            router = await worker.createRouter({ mediaCodecs: mediaCodecs })
            routers[chatId] = router
          }
          console.log("user here", router.rtpCapabilities)
          socket.emit("rtp-capabilities", router.rtpCapabilities)
        });

        socket.on("create-webrtc-transport", async ({chatId}, callback) => {
          let router
          if (routers[chatId]) {
            router = routers[chatId]
          }
          else {
            router = await worker.createRouter({ mediaCodecs: mediaCodecs })
            routers[chatId] = router
          }
          producertransport = await createWebRtcTransport(router)
          consumertransport = await createWebRtcTransport(router)
          callback({
            params: {
              id: producertransport.id,
              iceParameters: producertransport.iceParameters,
              iceCandidates: producertransport.iceCandidates,
              dtlsParameters: producertransport.dtlsParameters,
            }
          })

          socket.on("transport-connect", async ({ dtlsParameters }) => {
            await producertransport.connect({ dtlsParameters })
          })

          socket.on('transport-produce', async ({ kind, rtpParameters, appData }, callback) => {
            console.log("here")
            producer = await producertransport.produce({
              kind,
              rtpParameters
            })

            producer.on('transportclose', () => {
              console.log('transport for this producer closed ')
              producer.close()
            })
        
            // Send back to the client the Producer's id
            callback({
              id: producer.id
            })
          })
        })

      } else {
        socket.emit("error", "No authorisation");
      }
    } catch {
      socket.emit("error", "No authorisation");
    }
  } else {
    socket.emit("error", "No authorisation");
  }
});
