import mediasoup from 'mediasoup'

export const createWebRtcTransport = async (router) => {
  const transport_options = {
    listenIps: [
      {
        ip: "127.0.0.1"
      }
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  }

  const transport = await router.createWebRtcTransport(transport_options)

  transport.on("dtlsstatechange", state => {
    if (state == "closed") {
      transport.close()
    }
  })

  transport.on("close", ()   => {
    console.log("transport close")
  })

  return transport
}
