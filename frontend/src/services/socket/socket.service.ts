// src/services/socket.service.ts
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../../types/socket.types';
// import { ServerToClientEvents, ClientToServerEvents } from '../types/socket.types';
// import { AppDispatch } from '../store';
let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const initializeSocket = (userId: string | undefined) => {
    // const userId = useAppSelector(state => state.auth.user?._id)
    if (!socket) {
        socket = io('http://localhost:5000', {
            withCredentials: true,
            auth: userId ? { userId } : undefined
        });

        socket.on('connect', () => {
            console.log('Socket connected');
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }
    return socket;
};

export const getSocket = () => socket;
export const emit = <Event extends keyof ClientToServerEvents>(event: Event, ...data: Parameters<ClientToServerEvents[Event]>): void => {
    if (!socket) {
        console.warn('Socket not initialized - cannot emit');
        return;
    }
    (socket.emit as Function)(event, ...data);
};

export const onSocketEvent = <Event extends keyof ServerToClientEvents>(event: Event, callback: ServerToClientEvents[Event]): (() => void) => {
    if (!socket) {
        console.warn('Socket not initialized - cannot add listener');
        return () => { };
    }

    socket.off(event, callback as any);
    socket.on(event, callback as any);
    return () => {
        socket?.off(event as any, callback);
    };
};

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};