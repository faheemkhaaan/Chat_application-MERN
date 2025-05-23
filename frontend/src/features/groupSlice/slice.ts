import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Group, GroupInitialState, Message } from "../../types/slice.types";
import { createGroup, searchGroups } from "./thunks";

const initialState: GroupInitialState = {
    groups: {},
    groupPreviews: [],
    loading: false,
    error: null
};

const groupChatSlice = createSlice({
    name: "groupChat",
    initialState,
    reducers: {
        // Set all groups (e.g., when fetching initial data)
        setGroups: (state, action: PayloadAction<Group[]>) => {
            state.groups = {};
            if (action.payload.length === 0) return;
            action.payload.forEach(group => {
                state.groups[group._id] = group;
            });
        },
        // Update a specific group
        updateGroup: (state, action: PayloadAction<Group>) => {
            const group = action.payload;
            state.groups[group._id] = group;

            // Also update in previews if exists
            const previewIndex = state.groupPreviews.findIndex(g => g._id === group._id);
            if (previewIndex !== -1) {
                state.groupPreviews[previewIndex] = group;
            }
        },


        // Add a new message to a group
        addGroupMessage: (state, action: PayloadAction<{ groupId: string; message: Message }>) => {
            const { groupId, message } = action.payload;
            if (state.groups[groupId]) {
                state.groups[groupId].messages.push(message);

                // Update last message in preview
                const previewIndex = state.groupPreviews.findIndex(g => g._id === groupId);
                if (previewIndex !== -1) {
                    state.groupPreviews[previewIndex].messages = [message]; // Store only last message in preview
                }
            }
        },

        // Update message status (read/delivered)
        updateGroupMessageStatus: (
            state,
            action: PayloadAction<{
                groupId: string;
                messageId: string;
                status: 'delivered' | 'read'
            }>
        ) => {
            const { groupId, messageId, status } = action.payload;
            const group = state.groups[groupId];
            if (group) {
                const message = group.messages.find(m => m._id === messageId);
                if (message) {
                    message.status = status;
                }
            }
        },

        // Add a new group
        addGroup: (state, action: PayloadAction<Group>) => {
            const group = action.payload;
            state.groups[group._id] = group;
            state.groupPreviews.unshift(group); // Add to beginning of previews
        },

        // Remove a group
        removeGroup: (state, action: PayloadAction<string>) => {
            const groupId = action.payload;
            delete state.groups[groupId];
            state.groupPreviews = state.groupPreviews.filter(g => g._id !== groupId);


        },

        // Update group previews (for sidebar)
        setGroupPreviews: (state, action: PayloadAction<Group[]>) => {
            state.groupPreviews = action.payload;
        },

        // Reset to initial state
        resetGroups: () => initialState,
        onGroupMessageReaction: (state, action: PayloadAction<{ message: Message, groupId: string }>) => {
            const { message, groupId } = action.payload;
            const foundGroup = state.groups[groupId];
            if (foundGroup) {
                foundGroup.messages.forEach(msg => {
                    if (msg._id === message._id) {
                        msg.reactions = message.reactions;
                        msg.updatedAt = message.updatedAt
                    }
                })
            }
            console.log(action.payload);
        }
    },
    extraReducers(builder) {
        builder
            .addCase(createGroup.pending, (state) => {
                state.loading = true;

            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.groups[action.payload._id] = action.payload;
                state.loading = false;
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.loading = false;
                // state.error = action.payload;
                console.log(action.payload);
            })
            .addCase(searchGroups.pending, (state) => {
                state.loading = true;

            })
            .addCase(searchGroups.fulfilled, (state, action) => {
                state.groups = {};
                action.payload.forEach(group => {
                    state.groups[group._id] = group;
                })
                state.loading = false;
            })
            .addCase(searchGroups.rejected, (state, action) => {
                state.loading = false;
                console.log(action.payload);
            })
    }
});

export const {
    setGroups,
    updateGroup,
    addGroupMessage,
    updateGroupMessageStatus,
    addGroup,
    removeGroup,
    setGroupPreviews,
    resetGroups,
    onGroupMessageReaction
} = groupChatSlice.actions;

// Selectors

export const selectGroupPreviews = (state: { group: GroupInitialState }) =>
    state.group.groupPreviews;

export const selectGroupById = (groupId: string) => (state: { group: GroupInitialState }) =>
    state.group.groups[groupId];

export default groupChatSlice.reducer;