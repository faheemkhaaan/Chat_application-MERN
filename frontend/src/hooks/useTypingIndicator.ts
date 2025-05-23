import { useEffect, useState } from "react";
import { getSocket } from "../services/socket/socket.service";
import { RootState, useAppSelector } from "../store/store";
import { createSelector } from "@reduxjs/toolkit";

const useTypingIndicatorSelector = createSelector(
    [
        (state: RootState) => state.ui.selectedchatId.selectedUserId,
        (state: RootState) => state.auth.user?._id,
    ],
    (receiverId, senderId) => {
        return { receiverId, senderId }
    }
)

function useTypingIndicator() {
    const [isTyping, setIsTyping] = useState(false);
    const [typingUserId, setTypingUserId] = useState<string | null>(null)
    const { receiverId, senderId } = useAppSelector(useTypingIndicatorSelector)
    const socket = getSocket();
    const TYPING_TIMEOUT = 2000;
    let typingTimeout: NodeJS.Timeout
    const handleTyping = () => {
        if (!socket || !senderId || !receiverId) return


        // emitter.startTyping({ senderId, receiverId });

        socket.emit("typing:start", { senderId, receiverId });
        clearTimeout(typingTimeout)
        typingTimeout = setTimeout(() => {
            socket.emit("typing:stop", { senderId, receiverId });
        }, TYPING_TIMEOUT);
    }
    useEffect(() => {
        if (!socket) return;

        const handleTyping = ({ senderId }: { senderId: string }) => {
            // console.log(`${senderId} is typing`)
            setTypingUserId(senderId);
            setIsTyping(true)
        }
        const handleStopTyping = () => {
            // console.log("Stoped typing")
            setTypingUserId(null);
            setIsTyping(false);
        }
        const handleError = (error: any) => {
            console.error("Server error while updating status:", error);
            // Optionally show toast/alert
        };
        socket.on("typing:start", handleTyping)
        socket.on("typing:stop", handleStopTyping)
        socket.on("server-error", handleError);

        return () => {
            socket.off("server-error", handleError);
            socket.off("typing:start");
            socket.off("typing:stop")
        };
    }, []);
    return { isTyping, typingUserId, handleTyping }
}

export default useTypingIndicator