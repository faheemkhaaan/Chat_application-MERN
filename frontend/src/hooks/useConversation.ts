import { useState } from "react";
import { RootState, useAppSelector } from "../store/store";
import { createSelector } from "@reduxjs/toolkit";
import { emit, getSocket } from "../services/socket/socket.service";
import api from "../api/api";
import useBlockUser from "./useBlockUser";


const conversationData = createSelector([
    (state: RootState) => state.auth.user?._id,
    (state: RootState) => state.ui.selectedchatId.selectedUserId,
    (state: RootState) => state.conversations.conversations.conversationMap,
    (state: RootState) => state.conversations.conversations.entities,
    (state: RootState) => state.ui.selectedchatId.selectedGroupId,
    (state: RootState) => state.group.groups,
], (senderId, selectedUserId, conversationMap, messages, selectedGroupId, groups) => {
    const conversationId = selectedUserId ? conversationMap[selectedUserId] : null;
    const selectedGroupMessages = selectedGroupId ? groups[selectedGroupId]?.messages : [];
    const selectedChatId = selectedGroupId ? selectedGroupId : selectedUserId ? selectedUserId : null;
    return {
        senderId,
        selectedUserId,
        conversationId: conversationId || "",
        conversation: conversationId ? Object.values(messages[conversationId].messages.entities) || [] : selectedGroupMessages,
        selectedGroupId,
        selectedChatId
    };
})

function useConversation() {
    const { senderId, selectedUserId, conversationId, conversation, selectedGroupId, selectedChatId } = useAppSelector(conversationData)
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const socket = getSocket()
    // const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const { isBlocked } = useBlockUser();
    const handleSendMessage = async () => {
        if (!message || !senderId || !selectedChatId) return
        const event = selectedGroupId ? "sendMessageToGroup" : "message:send";
        console.log(event, message)
        emit(event, { senderId, receiverId: selectedChatId!, content: message });
        setMessage("")
    }
    const handleSelectedImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const images = Array.from(e.target.files);
            setSelectedImages(prev => ([...prev, ...images]))
        }
    }
    const handleSendImagesMessage = async () => {
        if (!senderId || !selectedUserId || !socket) return;
        if (isBlocked()) {
            return;
        }
        const formdata = new FormData();
        for (const element of selectedImages) {
            formdata.append('pictures', element)
        }
        try {
            const res = await api.post("/message/uploadMessageImage", formdata, { headers: { "Content-Type": "multipart/form-data" } });

            // setImageUrls(res.data.imageUrls)
            socket?.emit("sendImages", { senderId, receiverId: selectedUserId, images: res.data.imageUrls }, (ack: string) => {
                console.log(ack);
            });
        } catch (error) {
            console.log(error)
        }
        finally {
            setSelectedImages([]);
        }
    }

    return { senderId, selectedUserId, conversation, conversationId, handleSendMessage, message, setMessage, handleSelectedImage, selectedImages, setSelectedImages, handleSendImagesMessage }
}
export default useConversation