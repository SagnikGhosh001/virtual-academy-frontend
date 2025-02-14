import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = "http://localhost:9091/ws-chat"; 

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = {};
  }

  connect(onMessageReceived) {
    const socket = new SockJS(SOCKET_URL);
    this.client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket");
      },
    });

    this.client.activate();
  }

  subscribeToRoom(roomId, onMessageReceived) {
    if (this.client && this.client.connected) {
      this.subscriptions[roomId] = this.client.subscribe(
        `/topic/room/${roomId}`,
        (message) => {
          onMessageReceived(JSON.parse(message.body));
        }
      );
    } else {
      console.warn("WebSocket not connected yet.");
    }
  }

  sendMessage(roomId, message) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify(message),
      });
    }
  }

  editMessage(roomId, message) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: `/app/chat/${roomId}/edit`,
        body: JSON.stringify(message),
      });
    }
  }

  deleteMessage(roomId, message) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: `/app/chat/${roomId}/delete`,
        body: JSON.stringify(message),
      });
    }
  }
}

export default new WebSocketService();
