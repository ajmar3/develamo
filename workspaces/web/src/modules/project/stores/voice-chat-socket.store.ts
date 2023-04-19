import { io, Socket } from "socket.io-client";
import create from "zustand";
import { useFeedbackStore } from "modules/common/stores/feedback.store";
import { Device } from "mediasoup-client";
import { Transport } from "mediasoup-client/lib/types";
import { useProjectAuthStore } from "modules/auth/store/project-auth-store";

export interface IVoiceChatSocketStore {
  socket: Socket;
  initSocket: (chatId: string) => void;
  handleJoinRoom: (chatId: string) => void;
  handleLeaveRoom: (chatId: string) => void;
  inRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  channelPeerInfo: any[];
  setChannelPeerInfo: (channelPeerInfo: any[]) => void;
  addChannelPeerInfo: (channelPeerInfo: any) => void;
}

export const useVoiceChatSocketStore = create<IVoiceChatSocketStore>((set) => {
  const feedbackStore = useFeedbackStore.getState();
  let projectAuthStore = useProjectAuthStore.getState();

  const socket = io(process.env.NEXT_PUBLIC_VOICE_CHAT_WEBSOCKET_URL as string);

  let params = {
    encodings: [],
    codecOptions: {},
    track: {} as any,
  };
  let producerTransport: Transport;
  let consumerTransports: any[] = [];
  let device: Device;
  let producer;
  let producerIds: string[] = [];
  let channelId: string;
  let inMeeting = false;

  const getLocalStream = async (channelId: string) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    if (!stream || stream.getAudioTracks().length === 0) {
      feedbackStore.addMessage({
        message: "Could not get audio from your microphone",
        statusCode: 500,
        error: "No audio track found",
      });
    }

    const track = stream.getAudioTracks()[0];
    params["track"] = track;

    joinRoom(channelId);
  };

  const createDevice = async (rtpCapabilities: any) => {
    device = new Device();
    await device.load({ routerRtpCapabilities: rtpCapabilities });
  };

  const joinRoom = async (channelId: string) => {
    projectAuthStore = useProjectAuthStore.getState();
    socket.emit(
      "join-room",
      {
        channelId: channelId,
        developerId: projectAuthStore.devInfo?.id,
        developerName: projectAuthStore.devInfo?.name,
        developerAvatar: projectAuthStore.devInfo?.avatarURL,
        developerGithubName: projectAuthStore.devInfo?.githubUsername,
      },
      async (data: any) => {
        await createDevice(data.rtpCapabilities);
        await createSendTransport();
      }
    );
  };

  const createSendTransport = async () => {
    console.log(channelId);
    socket.emit(
      "createWebRtcTransport",
      { sender: true, channelId: channelId, developerId: projectAuthStore.devInfo?.id },
      async (params: any) => {
        producerTransport = device.createSendTransport(params);
        producerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback: any) => {
            socket.emit("transportConnect", {
              dtlsParameters,
              sender: true,
              channelId: channelId,
              id: params.id,
              developerId: projectAuthStore.devInfo?.id,
            });
            getProducers();
            callback({ id: params.id });
          }
        );

        producerTransport.on(
          "produce",
          async ({ kind, rtpParameters }, callback, errback) => {
            await socket.emit(
              "produce",
              { kind, rtpParameters, channelId: channelId, developerId: projectAuthStore.devInfo?.id },
              (data: any) => {
                callback({ id: params.id });
              }
            );
          }
        );

        await connectSendTransport();
      }
    );
  };

  const connectSendTransport = async () => {
    producer = await producerTransport.produce(params as any);
    producer.on("transportclose", () => {
      console.log("transportclose");
    });
    producer.on("trackended", () => {
      console.log("trackended");
    });
  };

  const createRecvTransport = async (producerId: string, peerId: string) => {
    if (producerIds.includes(producerId)) return;
    producerIds.push(producerId);

    socket.emit(
      "createWebRtcTransport",
      { sender: false, channelId: channelId, developerId: projectAuthStore.devInfo?.id },
      async (params: any) => {
        const consumerTransport = device.createRecvTransport(params);
        consumerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            socket.emit("transportConnect", {
              dtlsParameters,
              sender: false,
              id: params.id,
              channelId: channelId,
              developerId: projectAuthStore.devInfo?.id,
            });
            callback();
          }
        );
        await connectRecvTransport(consumerTransport, peerId, params.id);
      }
    );
  };

  const connectRecvTransport = async (
    consumerTransport: Transport,
    producerPeerId: string,
    serverConsumerId: string
  ) => {
    socket.emit(
      "consume",
      {
        rtpCapabilities: device.rtpCapabilities,
        channelId: channelId,
        consumerTransportId: serverConsumerId,
        producerPeerId: producerPeerId,
        developerId: projectAuthStore.devInfo?.id,
      },
      async (params: any) => {
        const consumer = await consumerTransport.consume(params);

        consumerTransports = [
          ...consumerTransports,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: params.producerId,
            consumer,
          },
        ];
        const track = consumer.track;
        let audio = new Audio();
        audio.srcObject = new MediaStream([track]);
        audio.play();
        socket.emit("resume", { channelId: channelId, consumerId: params.id, developerId: projectAuthStore.devInfo?.id });
      }
    );
  };

  const getProducers = async () => {
    socket.emit(
      "getProducers",
      { channelId: channelId, developerId: projectAuthStore.devInfo?.id },
      async (producerInfo: any) => {
        for (let producer of producerInfo) {
          await createRecvTransport(producer.id, producer.peerId);
        }
      }
    );
  };

  socket.on("new-producer", async (data: any) => {
    console.log("new-producer", data);
    if (data.peerId != projectAuthStore.devInfo?.id && inMeeting) {
      await createRecvTransport(data.id, data.peerId);
    }
    set((state) => {
      return {
        channelPeerInfo: data.info,
      };
    });
  });

  socket.on("init-room-participants", async (data: any) => {
    console.log("init-room-participants", data);
    set({ channelPeerInfo: data });
    if (data.find((x: any) => x.id == projectAuthStore.devInfo?.id)) {
      socket.emit("leave-room", { channelId: channelId, developerId: projectAuthStore.devInfo?.id });
      consumerTransports = [];
      producerIds = [];
      channelId = "";
      set({ inRoom: false });
    }
  });

  socket.on("producer-leave", async (data: any) => {
    console.log("producer-leave", data);
    set((state) => {
      return {
        channelPeerInfo: data.info,
      };
    });
  });


  socket.on("error", (error) => {
    console.log("error", error);
    feedbackStore.addMessage(error);
  });

  return {
    socket: socket,
    initSocket: (chatId: string) => {
      console.log("running init socket");
      socket.emit("connected", { channelId: chatId });
    },
    handleJoinRoom: async (id: string) => {
      channelId = id;
      await getLocalStream(channelId);
      set({ inRoom: true });
      inMeeting = true;
    },
    handleLeaveRoom: async (channelId: string) => {
      params.track.stop();
      socket.emit("leave-room", { channelId: channelId, developerId: projectAuthStore.devInfo?.id });
      consumerTransports = [];
      producerIds = [];
      channelId = "";
      set({ inRoom: false });
      inMeeting = false;
    },
    inRoom: false,
    setInRoom: (inRoom: boolean) => set({ inRoom }),
    channelPeerInfo: [],
    setChannelPeerInfo: (channelPeerInfo: any[]) => set({ channelPeerInfo }),
    addChannelPeerInfo: (channelPeerInfo: any) =>
      set((state) => {
        const newInfo = [...state.channelPeerInfo, channelPeerInfo];
        return { channelPeerInfo: newInfo };
      }),
  };
});
