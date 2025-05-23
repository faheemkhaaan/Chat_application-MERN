import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import rtcSocketEvents from "../hooks/useWebRtc/rtcSocketEvents";
import { getSocket } from "../services/socket/socket.service";
import { setAudio, setVideo } from "../features/useVideoCallSlice";
import { ISocket } from "../types/socket.types";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { createSelector } from "@reduxjs/toolkit";

// ... other imports ...

// Define types for your context
interface WebRTCContextType {
    localVideoRef: React.RefObject<HTMLVideoElement | null>;
    remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
    localVideoStreamRef: React.RefObject<MediaStream | null>;
    closeVideoCall: () => void;
    toggleAudio: (enabled: boolean) => void;
    toggleVideo: (enabled: boolean) => void;
    initLocalStream: () => Promise<MediaStream>;
    createPeerConnection: (stream: MediaStream) => RTCPeerConnection;
    audio: boolean;
    video: boolean;
}

const WebRTCContext = createContext<WebRTCContextType | null>(null);
export const useWebRtc = () => {
    const context = useContext(WebRTCContext);
    if (!context) {
        throw new Error("useWebRTC must be used within a WebRtcContextProvider");
    }
    return context
}
const webRtcSelector = createSelector(
    [
        (state: RootState) => state.auth.user?._id,
        (state: RootState) => state.ui.selectedchatId.selectedUserId,
        (state: RootState) => state.videoCall.audio,
        (state: RootState) => state.videoCall.video
    ], (senderId, receiverId, audio, video) => {
        return { senderId, receiverId, audio, video }
    }
)
const WebRtcContextProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch()
    const { senderId, receiverId, audio, video } = useAppSelector(webRtcSelector);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection>(null);
    const localVideoStreamRef = useRef<MediaStream | null>(null);
    const socketRef = useRef<ISocket | null>(null);

    const [streamStatus, setStreamStatus] = useState({
        hasLocalStream: false,
        hasRemoteStream: false
    });

    // Helper function to attach stream to video element
    const attachStreamToVideo = (stream: MediaStream | null, videoRef: React.RefObject<HTMLVideoElement | null>) => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;

            // Attempt to play the video (may require user interaction in some browsers)
            videoRef.current.play().catch(err => {
                console.warn("Autoplay prevented:", err);
            });

            return true;
        }
        return false;
    };
    function closeVideoCall() {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (localVideoStreamRef.current) {
            localVideoStreamRef.current.getTracks().forEach(track => track.stop());
            localVideoStreamRef.current = null;
        }
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
        setStreamStatus({
            hasLocalStream: false,
            hasRemoteStream: false
        });

        // console.log("Video call closed");
        // console.log("Video call closed")
    }
    function toggleAudio(enabled: boolean) {
        if (localVideoStreamRef.current) {
            localVideoStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = enabled;
            });
        };
        dispatch(setAudio(enabled));
    }
    function toggleVideo(enabled: boolean) {
        if (localVideoStreamRef.current) {
            localVideoStreamRef.current.getVideoTracks().forEach(track => {
                track.enabled = enabled
            })
        };
        dispatch(setVideo(enabled));
    }
    const initLocalStream = async () => {
        try {
            if (localVideoStreamRef.current) {
                // console.log("Using existing stream");

                // Re-attach it to make sure it's displayed
                const attached = attachStreamToVideo(localVideoStreamRef.current, localVideoRef);

                if (attached) {
                    setStreamStatus(prev => ({ ...prev, hasLocalStream: true }));
                    return localVideoStreamRef.current;
                }
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            const attached = attachStreamToVideo(stream, localVideoRef);

            if (attached) {
                setStreamStatus(prev => ({ ...prev, hasLocalStream: true }));
            } else {
                console.error("Failed to attach stream to video element");
            }
            localVideoStreamRef.current = stream;
            return stream;
        } catch (err) {
            console.error("Error accessing media devices:", err);
            throw err;
        }
    };
    const createPeerConnection = (stream: MediaStream) => {
        // console.log("Creating new peer connection");
        // Close any existing connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" }
            ]
        });
        // Add all tracks from the local stream to the peer connection
        stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
        });

        // Handle incoming remote streams
        peerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams;
            if (remoteVideoRef.current) {
                const attached = attachStreamToVideo(remoteStream, remoteVideoRef);

                if (attached) {
                    setStreamStatus(prev => ({ ...prev, hasRemoteStream: true }));
                }
            }
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit("ice-candidate", {
                    candidate: event.candidate,
                    senderId: senderId!,
                    receiverId: receiverId!
                });
            }
        };

        // Log connection state changes for debugging
        peerConnection.oniceconnectionstatechange = () => {
            console.log("ICE connection state:", peerConnection.iceConnectionState);
        };

        peerConnection.onsignalingstatechange = () => {
            console.log("Signaling state:", peerConnection.signalingState);
        };

        peerConnectionRef.current = peerConnection;
        return peerConnection;
    };
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !senderId || !receiverId) return;
        socketRef.current = socket


        const cleanups = rtcSocketEvents({ socket, peerConnectionRef, remoteVideoRef, senderId, receiverId });
        return () => {
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close()
            };
            if (localVideoStreamRef.current) {
                localVideoStreamRef.current.getTracks().forEach(track => track.stop())
            }
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = null
            };
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
            }
            setStreamStatus({
                hasLocalStream: false,
                hasRemoteStream: false
            });
            cleanups()
        }

    }, [senderId, receiverId]);
    useEffect(() => {
        const checkVideoConnections = () => {
            // Check if local video has srcObject but isn't marked as having a stream
            if (localVideoRef.current?.srcObject && !streamStatus.hasLocalStream) {
                setStreamStatus(prev => ({ ...prev, hasLocalStream: true }));
            }

            // Check if local video is supposed to have a stream but doesn't
            if (streamStatus.hasLocalStream &&
                localVideoStreamRef.current &&
                (!localVideoRef.current?.srcObject || localVideoRef.current.srcObject !== localVideoStreamRef.current)) {

                attachStreamToVideo(localVideoStreamRef.current, localVideoRef);
            }

            // Similar check for remote video
            if (remoteVideoRef.current?.srcObject && !streamStatus.hasRemoteStream) {
                setStreamStatus(prev => ({ ...prev, hasRemoteStream: true }));
            }
        };

        // Check initially and then periodically
        checkVideoConnections();
        const intervalId = setInterval(checkVideoConnections, 2000);

        return () => clearInterval(intervalId);
    }, [streamStatus]);
    const value = {
        localVideoRef,
        remoteVideoRef,
        localVideoStreamRef,
        closeVideoCall,
        toggleAudio,
        toggleVideo,
        initLocalStream,
        createPeerConnection,
        audio,
        video
    };
    return (
        <WebRTCContext.Provider value={value}>
            {children}
        </WebRTCContext.Provider>
    )
};

export default WebRtcContextProvider