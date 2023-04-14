import { io, Socket } from "socket.io-client";
import create from "zustand";
import { EditTicketListType, TicketListType } from "../types/kanban.types";
import { useKanbanStore } from "./kanban-store";
import { stringify } from "querystring";
import { useFeedbackStore } from "modules/common/stores/feedback.store";
import { Device } from "mediasoup-client";
import { Transport } from "mediasoup-client/lib/types";

export interface IVoiceChatSocketStore {
  socket: Socket;
  initSocket: (chatId: string) => void;
  handleJoinRoom: (chatId: string) => void;
}

export const useVoiceChatSocketStore = create<IVoiceChatSocketStore>((set) => {
  const feedbackStore = useFeedbackStore.getState();

  const socket = io(
    process.env.NEXT_PUBLIC_VOICE_CHAT_WEBSOCKET_URL as string,
    {
      withCredentials: true,
    }
  );

  socket.on("error", (error) => {
    feedbackStore.addMessage(error);
  });

  socket.on(
    "unopened-voice-chat-info",
    (data: { chatId: string; participants: any[] }) => {}
  );

  let joiningRoom = false;
  let audioParams: any = {
    // mediasoup params
    encodings: [
      {
        rid: "r0",
        maxBitrate: 100000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r1",
        maxBitrate: 300000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r2",
        maxBitrate: 900000,
        scalabilityMode: "S1T3",
      },
    ],
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
    codecOptions: {
      videoGoogleStartBitrate: 1000,
    },
  };
  let rtpCapabilities: any;
  let device: Device;
  let globalChatId: string = "";
  let producerTransport: Transport;

  const createSendDevice = async (rtpCapabilities: any) => {
    // create device
    device = new Device();

    await device.load({
      routerRtpCapabilities: rtpCapabilities
    });

    // once device loads create a send transport
    await createSendTransport();
  };

  const createSendTransport = () => {
    socket.emit("createWebrtcTransport", { consumer: false }, async ({ params }: any) => {
      const producerTransport = device.createSendTransport(params);

      producerTransport.on("connect", async ({ dtlsParameters }, callback) => {
        socket.emit("transport-connect", {
          dtlsParameters
        });
        callback();
      });

      producerTransport.on("produce", async (params, callback) => {
        await socket.emit('transport-produce', {
          kind: params.kind,
          rtpParameters: params.rtpParameters,
          appData: params.appData,
        }, ({ id, producersExist }: any) => {
          // Tell the transport that parameters were transmitted and provide it with the
          // server side producer's id.
          callback({ id });

          // if producers exist, then join room
          // if (producersExist) getProducers()
        });
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const track = stream.getAudioTracks()[0];
      audioParams = {
        track,
        ...audioParams,
      };
      const audioProducer = await producerTransport.produce(audioParams);

      audioProducer.on('trackended', () => {
        console.log('audio track ended');    
      });
    
      audioProducer.on('transportclose', () => {
        console.log('audio transport ended');    
      });

    });
  };

  return {
    socket: socket,
    initSocket: (chatId: string) => {
      socket.emit("connected", chatId);
    },
    handleJoinRoom: async (chatId: string) => {
      if (joiningRoom) return;
      joiningRoom = true;

      socket.emit("join-chat", chatId, (data: any) => {
        console.log("Router RTP Capabilities", data.rtpCapabilities);
        
      });
    },
  };
});
