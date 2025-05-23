// features/videoCallSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VideoCallState {
    ringing: boolean;
    callFromId: string | null;
    isVideoCallOpen: boolean;
    audio: boolean;
    video: boolean;
}

const initialState: VideoCallState = {
    ringing: false,
    callFromId: null,
    isVideoCallOpen: false,
    audio: true,
    video: true
};

const videoCallSlice = createSlice({
    name: "videoCall",
    initialState,
    reducers: {
        setRinging: (state, action: PayloadAction<{ fromId: string }>) => {
            state.ringing = true;
            state.callFromId = action.payload.fromId;
        },
        stopRinging: (state) => {
            state.ringing = false;
            state.callFromId = null;
        },
        openCall: (state) => {
            state.isVideoCallOpen = true;
        },
        closeCall: (state) => {
            state.isVideoCallOpen = false;
        },
        setAudio: (state, action: PayloadAction<boolean>) => {
            state.audio = action.payload;
        },
        setVideo: (state, action: PayloadAction<boolean>) => {
            state.video = action.payload;
        }
    },
});

export const { setRinging, stopRinging, openCall, closeCall, setVideo, setAudio } = videoCallSlice.actions;
export default videoCallSlice.reducer;
