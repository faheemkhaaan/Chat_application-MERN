import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from '../features/authSlice/authSlice';
import userReducer from '../features/user/userSlice'
// import messagesReducer from '../features/messagesSlice';
import socketReducer from '../features/socketSlice/slice'
import conversationsReducer from '../features/conversationSlice/conversationSlice';
import groupReducer from '../features/groupSlice/slice'
import videoCallReducer from '../features/useVideoCallSlice';
import uiReducer from '../features/uiSlice/slice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        // messages: messagesReducer,
        socket: socketReducer,
        conversations: conversationsReducer,
        group: groupReducer,
        videoCall: videoCallReducer,
        ui: uiReducer
    },
});

// Infer types for RootState & AppDispatch
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector