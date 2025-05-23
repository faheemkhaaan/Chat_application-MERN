// features/messages/messagesSlice.ts
import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../types/slice.types";


const messagesAdapter = createEntityAdapter({
    selectId: (message: Message) => message._id,
    sortComparer: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
});

interface MessagesState {
    loading: boolean;
    error: string | null;
    conversationMap: { [userId: string]: string };
}

const initialState = messagesAdapter.getInitialState<MessagesState>({
    loading: false,
    error: null,
    conversationMap: {},
});

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        messageReceived: messagesAdapter.addOne,
        messageUpdated: messagesAdapter.updateOne,
        messageDeleted: (state, action: PayloadAction<string>) => {
            messagesAdapter.updateOne(state, {
                id: action.payload,
                changes: { isDeleted: true, content: {} }
            });
        },
        setConversationId: (state, action: PayloadAction<{ userId: string, conversationId: string }>) => {
            state.conversationMap[action.payload.userId] = action.payload.conversationId;
        },
    },
});

export const {
    messageReceived,
    messageUpdated,
    messageDeleted,
    setConversationId,
} = messagesSlice.actions;

export const {
    selectAll: selectAllMessages,
    selectById: selectMessageById,
    selectIds: selectMessageIds,
} = messagesAdapter.getSelectors();

export default messagesSlice.reducer;