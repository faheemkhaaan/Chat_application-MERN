import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { getSocket } from "../services/socket/socket.service";
import { createSelector } from "@reduxjs/toolkit";
import { onClearPreviews } from "../features/conversationSlice/conversationSlice";
import { getAllMessages } from "../features/messages/thunks";

const selectConversationData = createSelector(
    [
        (state: RootState) => state.auth.user?._id,
        (state: RootState) => state.ui.selectedchatId.selectedUserId,
        (state: RootState) => state.conversations.conversations.conversationMap,
        (state: RootState) => state.conversations.conversations.entities
    ],
    (loggedInUserId, selectUserId, conversationMap, messages) => {
        const conversationId = selectUserId ? conversationMap[selectUserId] : null;
        return {
            loggedInUserId,
            conversationId,
            messages: conversationId ? Object.values(messages[conversationId]) || [] : [],
            selectedUserId: selectUserId
        };
    }
);
function useUserMessage() {
    const dispatch = useAppDispatch();
    const { loggedInUserId, selectedUserId, conversationId, messages } = useAppSelector(selectConversationData)
    const handleFetchMessages = () => {
        if (!selectedUserId) return;
        dispatch(getAllMessages({ receiverId: selectedUserId }))
    }
    useEffect(() => {
        const socket = getSocket();
        if (socket && conversationId && loggedInUserId) {
            socket.emit("selectedChat", {
                conversationId: conversationId,
                userId: loggedInUserId
            });
            dispatch(onClearPreviews({ id: conversationId }));
        }
    }, [conversationId, messages.length]);
    return { handleFetchMessages }
}
export default useUserMessage