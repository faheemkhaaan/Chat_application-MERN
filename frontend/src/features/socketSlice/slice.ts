// src/features/socket/socketSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface SocketState {
    isConnected: boolean;
}

const initialState: SocketState = {
    isConnected: false,
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        connectionEstablished(state) {
            state.isConnected = true;
        },
        connectionLost(state) {
            state.isConnected = false;
        },
    },
});

export const { connectionEstablished, connectionLost } = socketSlice.actions;
export default socketSlice.reducer;