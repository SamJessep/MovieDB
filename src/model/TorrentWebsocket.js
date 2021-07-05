import config from "../config"

export default class TorrentWebSocket{
  static Connect(){
    const websocket = new WebSocket(config.AZURE_WSS+"ws")
    return websocket;
  }

  static Close(socket, code=1000){
    socket.close(code)
  }
}