// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { RootState } from "../store/store";
// import { Message, MessagesState } from "../types/slice.types";
// import { getAllMessages } from "./messages/thunks";

// const initialState: MessagesState = {
//     messages: {},
//     loading: false,
//     error: undefined,
//     conversationMap: {},
// };

// const messagesSlice = createSlice({
//     name: "messages",
//     initialState,
//     reducers: {
//         addNewMessage: (state, action: PayloadAction<{ id: string, message: Message }>) => {
//             const { id } = action.payload;
//             // console.log(action.payload)
//             if (!state.messages[id]) {
//                 state.messages[id] = [];
//             }
//             state.messages[id].push(action.payload.message);
//         },
//         updateMessageStatus: (state, action: PayloadAction<{ conversationId: string, id: string, senderId: string, receiverId: string, status: "sent" | "delivered" | "read" }>) => {
//             const { conversationId, id, status } = action.payload;
//             const conversationMessages = state.messages[conversationId];

//             if (!conversationMessages) return;
//             const message = conversationMessages.find(msg => msg._id === id);
//             if (message) {
//                 message.status = status;
//             }
//         },
//         setConversationId: (state, action: PayloadAction<{ userId: string, conversationId: string }>) => {
//             state.conversationMap[action.payload.userId] = action.payload.conversationId;
//         },
//         onMessageDeleted: (state, action: PayloadAction<{ userId: string, message: Message }>) => {
//             const { userId, message } = action.payload
//             const conversationId = state.conversationMap[userId];
//             const conversationMessages = state.messages[conversationId];
//             let foundMessage = conversationMessages.find(msg => msg._id === message._id);
//             if (foundMessage) {
//                 foundMessage.updatedAt = message.updatedAt;
//                 foundMessage.content = {};
//                 foundMessage.isDeleted = true;
//             }

//         },
//         onAddReaction: (state, action: PayloadAction<{ userId: string, message: Message }>) => {
//             const { userId, message } = action.payload;
//             const conversationId = state.conversationMap[userId];
//             const conversationMessages = state.messages[conversationId];
//             let foundMessage = conversationMessages.find(msg => msg._id === message._id);
//             if (foundMessage) {
//                 foundMessage.updatedAt = message.updatedAt;
//                 foundMessage.reactions = message.reactions;
//             }
//         }
//     },
//     extraReducers(builder) {
//         builder
//             .addCase(getAllMessages.pending, (state, action) => {
//                 state.loading = true;
//             })
//             .addCase(getAllMessages.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const { conversation } = action.payload;
//                 console.log(conversation.id)
//                 state.messages[conversation.id] = conversation.messages;
//                 const receiverId = action.meta.arg.receiverId;
//                 state.conversationMap[receiverId] = conversation.id
//                 state.error = undefined;
//             })
//             .addCase(getAllMessages.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;

//             })
//     }
// })
// export const selectMessagesByConversation = (state: RootState, conversationId: string) =>
//     state.messages.messages[conversationId] || [];

// export const { addNewMessage, updateMessageStatus, onMessageDeleted, onAddReaction } = messagesSlice.actions
// export default messagesSlice.reducer;