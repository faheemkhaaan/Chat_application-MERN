import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";

// import { User } from "./userSlice";
import api from "../../api/api";
import { Group, Message, User } from "../../types/slice.types";
import { getAllMessages } from "./thunks";

interface ConversationMeta {
    lastRead: string;
    unreadCount: number;
    isMuted: boolean;
}
const messageAdapter = createEntityAdapter({
    selectId: (message: Message) => message._id,
    sortComparer: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
});

// interface MessageMap { [messageId: string]: Message };
interface Conversation {
    _id: string;
    messages: EntityState<Message, string>;
    hasMore: boolean;
    lastFetched: string;
    typingUsers: string[];
    _meta: ConversationMeta
}
const conversationAdapter = createEntityAdapter<Conversation, string>({
    selectId: (conversation) => conversation._id,

})
interface GroupConversationMeta {
    lastMessageReadBy: EntityState<Message, string>;
}
interface GroupConversation {
    _id: string;
    messages: EntityState<Message, string>;
    hasMore: boolean;
    typingUsers: string[];
    _meta: GroupConversationMeta;
}
const groupConversationsAdapter = createEntityAdapter<GroupConversation, string>({
    selectId: (conversations) => conversations._id
})
interface ConversationPreview {
    _id: string;
    userId: string;
    unreadCount: number;
    lastMessage: Message | null;
}
interface GroupePreview {
    _id: string;
    lastMessage: string;
    unreadCount: number;
}
const conversationPreviewsAdapter = createEntityAdapter<ConversationPreview, string>({
    selectId: (preview) => preview._id
})
const groupPreviews = createEntityAdapter<GroupePreview, string>({
    selectId: (preview) => preview._id
})
interface Previews {
    conversatoinPreviews: EntityState<ConversationPreview, string>;
    groupPrivews: EntityState<GroupePreview, string>
}
interface SelectedChat {
    selectedUser: User | null;
    selectedGroup: Group | null;
}
type ConversationMap = {
    [receiverId: string]: string
}
interface ExtendedConversationState extends EntityState<Conversation, string> {
    conversationMap: ConversationMap
}
interface ConversationState {
    conversations: ExtendedConversationState;
    groupConversations: EntityState<GroupConversation, string>;
    previews: Previews;
    selectedChat: SelectedChat;
    messageStatus: {
        pendingMessages: EntityState<Message, string>;
        failedMessages: EntityState<Message, string>;
    },
    loading: boolean;
    error?: string | null;
}
// type Preview = {
//     _id: string; // conversationId
//     user: string;
//     lastMessage: Message | null;
//     unreadCount: number;
// }

// type ChatPreviewState = {
//     previews: { [conversationId: string]: Preview };
//     loading: boolean;
//     error?: string;
// }


const initialState: ConversationState = {
    conversations: conversationAdapter.getInitialState<ExtendedConversationState>({ conversationMap: {}, ids: [], entities: {} }),
    groupConversations: groupConversationsAdapter.getInitialState(),
    previews: {
        conversatoinPreviews: conversationPreviewsAdapter.getInitialState(),
        groupPrivews: groupPreviews.getInitialState(),
    },
    selectedChat: {
        selectedGroup: null,
        selectedUser: null
    },
    messageStatus: {
        pendingMessages: messageAdapter.getInitialState(),
        failedMessages: messageAdapter.getInitialState(),
    },
    loading: false,
    error: null

}

export const fetchPreviews = createAsyncThunk<ConversationPreview[]>("/chat/previews", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/message/conversationPreviews");
        return res.data?.conversations;
    } catch (error) {
        return rejectWithValue(error);
    }
});
export const fetchGroupPreviews = createAsyncThunk("/chat/groupPreviews", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/group/groupPreviews");
        return res.data?.groupPreviews;
    } catch (error) {
        return rejectWithValue(error)
    }
})
const conversationsSlice = createSlice({
    name: "conversations",
    initialState,
    reducers: {

        addMessageToConversation: (state, action: PayloadAction<{ id: string, message: Message }>) => {
            const { id, message } = action.payload;
            const conversation = state.conversations.entities[id]
            if (conversation) {
                messageAdapter.addOne(conversation.messages, message)
            }
            console.log(action.payload)
        },
        updateMessageStatus: (state, action: PayloadAction<{ conversationId: string, id: string, senderId: string, receiverId: string, status: "sent" | "delivered" | "read" }>) => {
            const { conversationId } = action.payload
            const conversation = state.conversations.entities[conversationId]
            console.log(conversationId)
            if (conversation) {
                const updates = conversation.messages.ids.map(messageId => {
                    const message = conversation.messages.entities[messageId];
                    console.log(message, "This is a message inside the updateMessageStatus")
                    // if (message.senderId === senderId) {
                    //     return { id: messageId, changes: { status } }
                    // }
                    return null
                }).filter(Boolean)
                console.log(updates)
                // messageAdapter.updateMany(conversation.messages, { status: "read" })
            }
        },
        updatePreview: (state, action: PayloadAction<ConversationPreview[]>) => {
            // console.log(action.payload)
            conversationPreviewsAdapter.setAll(state.previews.conversatoinPreviews, action.payload)


        },
        onClearPreviews: (state, action: PayloadAction<{ id: string }>) => {

            console.log("Clearing the previews")
            const { id } = action.payload
            conversationPreviewsAdapter.updateOne(state.previews.conversatoinPreviews, {
                id,
                changes: { lastMessage: null, unreadCount: 0 }
            })
        },
        onAddReactionToUserMessage: (state, action: PayloadAction<{ userId: string, message: Message }>) => {
            const { userId, message } = action.payload
            const conversationId = state.conversations.conversationMap[userId];
            const conversation = state.conversations.entities[conversationId];

            console.log(userId, message);
            // console.log("Found conversation to add reaction to the message", conversation);
            if (conversation) {
                messageAdapter.updateOne(conversation.messages, {
                    id: message._id,
                    changes: { reactions: message.reactions, updatedAt: message.updatedAt }
                });
                console.info("Updated message reactions")
            }
        },
        onMessageDeleted: (state, action: PayloadAction<{ userId: string, message: Message }>) => {
            const { userId, message } = action.payload;
            const conversationId = state.conversations.conversationMap[userId];
            const conversation = state.conversations.entities[conversationId];
            if (conversation) {
                messageAdapter.updateOne(conversation.messages, {
                    id: message._id,
                    changes: { updatedAt: message.updatedAt, content: {}, isDeleted: message.isDeleted }
                })
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPreviews.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPreviews.fulfilled, (state, action) => {

                state.loading = false;
                // console.log(action.payload)
                conversationPreviewsAdapter.setAll(state.previews.conversatoinPreviews, action.payload)
            })
            .addCase(fetchPreviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchGroupPreviews.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGroupPreviews.fulfilled, (state) => {

                state.loading = false;
            })
            .addCase(fetchGroupPreviews.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(getAllMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllMessages.fulfilled, (state, action) => {
                const { conversation } = action.payload
                const receiverId = action.meta.arg.receiverId
                state.loading = false
                const apdatedConversation: Conversation = {
                    _id: conversation.id,
                    messages: messageAdapter.setAll(messageAdapter.getInitialState(), conversation.messages),
                    hasMore: false,
                    lastFetched: new Date().toISOString(),
                    typingUsers: [],
                    _meta: {
                        lastRead: "",
                        unreadCount: 0,
                        isMuted: false
                    }
                }

                state.conversations.conversationMap[receiverId] = conversation.id

                conversationAdapter.setOne(state.conversations, apdatedConversation)

                // console.log(conversation)
            })
            .addCase(getAllMessages.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export const { updatePreview, onClearPreviews, addMessageToConversation, updateMessageStatus, onAddReactionToUserMessage, onMessageDeleted } = conversationsSlice.actions;

export default conversationsSlice.reducer;