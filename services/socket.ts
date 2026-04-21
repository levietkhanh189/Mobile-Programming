import { io, Socket } from 'socket.io-client';

// Strip /api from the base URL — socket.io connects to root
const SOCKET_BASE = 'https://backend-production-9c18.up.railway.app';

let socket: Socket | null = null;

export function connectSocket(token: string): void {
  if (socket?.connected) return;
  socket = io(SOCKET_BASE, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
  });
  socket.on('connect', () => console.log('[Socket] connected:', socket?.id));
  socket.on('connect_error', (err) => console.warn('[Socket] connect error:', err.message));
  socket.on('disconnect', (reason) => console.log('[Socket] disconnected:', reason));
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}
