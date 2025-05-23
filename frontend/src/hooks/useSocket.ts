import { useEffect, useRef } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { disconnectSocket, initializeSocket } from "../services/socket/socket.service";
import { createSelector } from "@reduxjs/toolkit";
import EventListeners from "../services/socket/socketListener.service";


const useSocektSelector = createSelector(
    [
        (state: RootState) => state.ui.selectedchatId.selectedUserId,
        (state: RootState) => state.conversations.conversations,
        (state: RootState) => state.ui.selectedchatId.selectedGroupId,
    ], (selectedUserId, conversation, selectedGroupId) => {
        const conversationId = selectedUserId ? conversation.conversationMap[selectedUserId] : undefined;

        return { selectedConversationId: conversationId, selectedGroupId }
    }
)

function useSocket() {
    const { selectedConversationId, selectedGroupId } = useAppSelector(useSocektSelector);
    const dispatch = useAppDispatch();
    const { authenticated, user } = useAppSelector(state => state.auth);

    const eventListenersRef = useRef<EventListeners | null>(null)
    useEffect(() => {
        if (!authenticated || !user?._id) {
            disconnectSocket();
            return;
        }
        initializeSocket(user._id);
        const eventListeners = new EventListeners(dispatch)
        eventListeners.setup()
        eventListenersRef.current = eventListeners;
        eventListeners.updateSelection(selectedConversationId, selectedGroupId!)
        return () => {
            disconnectSocket();
            if (eventListenersRef.current) {

                eventListenersRef.current.cleanup();
            }
        };
    }, [dispatch, authenticated, user?._id]);;

    useEffect(() => {
        if (eventListenersRef.current) {
            eventListenersRef.current.updateSelection(selectedConversationId, selectedGroupId!);
        }
    }, [selectedConversationId, selectedGroupId])


}

export default useSocket;