import { createSelector } from "@reduxjs/toolkit";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { useEffect } from "react";
import { closeCall, openCall, setRinging, stopRinging } from "../features/useVideoCallSlice";
import { useWebRtc } from "../context/WebRtcContext";
import { getSocket } from "../services/socket/socket.service";

const useVideoCallSelector = createSelector(
    [
        (state: RootState) => state.auth.user?._id,
        (state: RootState) => state.ui.selectedchatId.selectedUserId,
        (state: RootState) => state.videoCall.ringing,
        (state: RootState) => state.videoCall.callFromId,
        (state: RootState) => state.videoCall.isVideoCallOpen,
    ],
    (senderId, receiverId, ringing, callFromId, isVideoCallOpen) => {
        return { senderId, receiverId, ringing, callFromId, isVideoCallOpen };
    }
);

function useVideoCall() {
    const dispatch = useAppDispatch();
    const { senderId, receiverId, ringing, callFromId, isVideoCallOpen } = useAppSelector(useVideoCallSelector);
    const {
        initLocalStream,
        createPeerConnection,
        localVideoStreamRef,
        localVideoRef, // Add this to ensure direct reference
        closeVideoCall
    } = useWebRtc();

    const socket = getSocket();

    const startCall = async () => {
        if (!socket || !senderId || !receiverId) return;

        try {
            console.log("Call started");

            // Initialize stream if not already done
            if (!localVideoStreamRef.current) {
                await initLocalStream();
            }

            if (!localVideoStreamRef.current) {
                console.error("Failed to initialize local stream");
                return;
            }

            // Create peer connection
            createPeerConnection(localVideoStreamRef.current);

            // Signal to the server we're calling
            socket.emit("call:initiate", { senderId, receiverId });
            console.log(`calling user with id ${receiverId}`);

            // Open video call UI
            dispatch(openCall());

        } catch (error) {
            console.log("Error initiating call:", error);
        }
    };

    const acceptCall = async () => {
        if (!socket || !senderId || !callFromId) return;

        try {
            console.log("Accepting call from", callFromId);

            // First open the UI so video elements are rendered
            dispatch(openCall());

            // Small delay to ensure UI is ready
            await new Promise(resolve => setTimeout(resolve, 100));

            // Initialize stream if not already done
            if (!localVideoStreamRef.current) {
                const stream = await initLocalStream();
                console.log("Stream initialized:", stream);

                if (!stream) {
                    throw new Error('Failed to initialize local stream');
                }

                // Explicitly set srcObject on video element again
                if (localVideoRef && localVideoRef.current) {
                    console.log("Setting srcObject on video element");
                    localVideoRef.current.srcObject = stream;

                    // Force play (might help with some browsers)
                    try {
                        await localVideoRef.current.play();
                    } catch (e) {
                        console.warn("Autoplay failed, may need user interaction:", e);
                    }
                }
            }

            if (!localVideoStreamRef.current) {
                console.error("Failed to initialize local stream");
                return;
            }

            console.log("Local stream initialized");

            // Create peer connection
            createPeerConnection(localVideoStreamRef.current);

            // Signal that we've accepted the call
            socket.emit("call:accept", { senderId, receiverId: callFromId });
            console.log("CALL ACCEPTED");

            // Stop ringing sound/indication
            dispatch(stopRinging());

        } catch (error) {
            console.error("Error accepting call:", error);
        }
    };

    const declineCall = () => {
        if (!socket || !senderId || !callFromId) return;
        socket.emit('call:reject', { senderId, receiverId: callFromId });
        socket.emit("call:end", { senderId, receiverId: callFromId });
        dispatch(stopRinging());
    };

    const endCall = () => {
        if (!socket || !senderId || !receiverId) return;
        socket.emit("call:end", { senderId, receiverId });
        dispatch(closeCall());
    };

    const setIsVideoCallOpen = () => {
        if (isVideoCallOpen) {
            dispatch(closeCall());
        } else {
            dispatch(openCall());
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket.on("ringing", ({ senderId }: { senderId: string }) => {
            dispatch(setRinging({ fromId: senderId }));
            console.log("ringing from userID:", senderId);
        });

        socket.on("call:end", () => {
            dispatch(stopRinging());
        });
        socket.on("call:reject", () => {
            dispatch(closeCall());
            closeVideoCall();
        })

        return () => {
            socket.off("ringing");
            socket.off("call:end");
            socket.off("call:reject")
        };
    }, [socket, dispatch]);

    return {
        startCall,
        acceptCall,
        declineCall,
        ringing,
        callFromId,
        isVideoCallOpen,
        setIsVideoCallOpen,
        endCall
    };
}

export default useVideoCall;