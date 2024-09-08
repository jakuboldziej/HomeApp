import { io } from "socket.io-client";

export const socketUrl = process.env.NODE_ENV === "development" ? process.env.EXPO_PUBLIC_SOCKETIO_URL_LOCAL : process.env.EXPO_PUBLIC_BACKEND_URL

export const socket = io(socketUrl, {
  autoConnect: false,
  transports: ['websocket'],
});

socket.on('connect', () => {
  // console.log('Connected to socketio server', socketUrl);
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message);
});