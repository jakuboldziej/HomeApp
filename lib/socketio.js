import { io } from "socket.io-client";
import { AppState } from 'react-native';

export const socketUrl = process.env.NODE_ENV === "development" ? process.env.EXPO_PUBLIC_BACKEND_URL_LOCAL : process.env.EXPO_PUBLIC_BACKEND_URL

export const socket = io(socketUrl, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
  timeout: 20000,
  forceNew: false,
  upgrade: true,
  extraHeaders: {
    'ngrok-skip-browser-warning': 'true'
  }
});

let isConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = Infinity;
let appStateSubscription = null;

const activeRooms = new Set();

export const trackRoom = (roomId) => {
  if (roomId) {
    activeRooms.add(roomId);
  }
};

export const untrackRoom = (roomId) => {
  if (roomId) {
    activeRooms.delete(roomId);
  }
};

export const getActiveRooms = () => Array.from(activeRooms);

const handleAppStateChange = (nextAppState) => {
  if (nextAppState === 'active') {
    if (!socket.connected && isConnected) {
      console.log('App became active, reconnecting socket...');
      socket.connect();
    }
  } else if (nextAppState === 'background') {
    console.log('App went to background');
  }
};

// Start listening to app state changes
if (!appStateSubscription) {
  appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
}

socket.on('connect', () => {
  isConnected = true;
  const wasReconnecting = reconnectAttempts > 0;
  reconnectAttempts = 0;
  console.log('Socket connected:', socket.id);
  
  if (activeRooms.size > 0) {
    activeRooms.forEach(roomId => {
      console.log('Rejoining room:', roomId);
      socket.emit("joinLiveGamePreview", JSON.stringify({ gameCode: roomId }));
    });
  }
});

socket.on('disconnect', (reason) => {
  isConnected = false;
  console.log('Socket disconnected:', reason);

  if (reason === 'io server disconnect' || reason === 'transport close' || reason === 'transport error') {
    setTimeout(() => {
      if (!socket.connected) {
        socket.connect();
      }
    }, 1000);
  }
});

socket.on('connect_error', (error) => {
  reconnectAttempts++;

  if (reconnectAttempts >= 3 && reconnectAttempts % 3 === 0) {
    console.error(`Connection error (attempt ${reconnectAttempts}):`, error.message);
  }
});

socket.on('reconnect', (attemptNumber) => {
  reconnectAttempts = 0;
  console.log(`Socket reconnected after ${attemptNumber} attempts`);
});

socket.on('reconnect_error', (error) => {
  if (reconnectAttempts >= 3) {
    console.error('Reconnection error:', error.message);
  }
});

socket.on('reconnect_failed', () => {
  console.error('Failed to reconnect after all attempts');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Heartbeat to keep connection alive
let heartbeatInterval;

const startHeartbeat = () => {
  if (heartbeatInterval) clearInterval(heartbeatInterval);

  heartbeatInterval = setInterval(() => {
    if (socket.connected) {
      socket.emit('heartbeat');
    } else {
      console.log('Heartbeat: Socket disconnected, attempting reconnect...');
      socket.connect();
    }
  }, 25000); // 25 seconds
};

const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
};

socket.on('connect', startHeartbeat);
socket.on('disconnect', stopHeartbeat);

socket.on('heartbeat-ack', () => {
  // Silent acknowledgment
});

export const isSocketConnected = () => socket.connected && isConnected;

export const ensureSocketConnection = () => {
  if (!socket.connected) {
    console.log('Ensuring socket connection...');
    socket.connect();
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 10000);

      socket.once('connect', () => {
        clearTimeout(timeout);
        console.log('Socket connection established');
        resolve();
      });

      socket.once('connect_error', (error) => {
        clearTimeout(timeout);
        console.error('Socket connection error:', error);
        reject(error);
      });
    });
  }
  return Promise.resolve();
};

export const cleanupSocket = () => {
  stopHeartbeat();
  if (appStateSubscription) {
    appStateSubscription.remove();
    appStateSubscription = null;
  }
};