// import { useEffect, useRef, useState } from "react"
// import { getSocket } from "../../services/socket.service"
// import { ISocket } from "../../types/socket.types";
// import { RootState, useAppDispatch, useAppSelector } from "../../store/store";
// import { createSelector } from "@reduxjs/toolkit";
// import rtcSocketEvents from "./rtcSocketEvents";
// import init from "./init";
// import { setAudio, setVideo } from "../../features/useVideoCallSlice";


// const webRtcSelector = createSelector(
//     [
//         (state: RootState) => state.auth.user?._id,
//         (state: RootState) => state.users.selectedUser?._id,
//         (state: RootState) => state.videoCall.audio,
//         (state: RootState) => state.videoCall.video
//     ], (senderId, receiverId, audio, video) => {
//         return { senderId, receiverId, audio, video }
//     }
// )
// function useWebRtc() {
//     const dispatch = useAppDispatch()
//     const { senderId, receiverId, audio, video } = useAppSelector(webRtcSelector);
//     const localVideoRef = useRef<HTMLVideoElement | null>(null);
//     const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
//     const peerConnectionRef = useRef<RTCPeerConnection>(null);
//     const localVideoStreamRef = useRef<MediaStream | null>(null);
//     const socketRef = useRef<ISocket | null>(null);
//     function closeVideoCall() {
//         if (!peerConnectionRef.current || !localVideoRef.current || !localVideoStreamRef.current) return;

//         peerConnectionRef.current.close();
//         localVideoRef.current.srcObject = null;
//         localVideoStreamRef.current.getTracks().forEach(track => track.stop());
//     }
//     function toggleAudio(enabled: boolean) {
//         if (localVideoStreamRef.current) {
//             localVideoStreamRef.current.getAudioTracks().forEach(track => {
//                 track.enabled = enabled;
//             });
//         };
//         dispatch(setAudio(enabled));
//     }
//     function toggleVideo(enabled: boolean) {
//         if (localVideoStreamRef.current) {
//             localVideoStreamRef.current.getVideoTracks().forEach(track => {
//                 track.enabled = enabled
//             })
//         };
//         dispatch(setVideo(enabled));
//     }
//     const initLocalStream = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//             if (localVideoRef.current) {
//                 localVideoRef.current.srcObject = stream;
//             }
//             localVideoStreamRef.current = stream;
//             return stream;
//         } catch (err) {
//             console.error("Error accessing media devices:", err);
//             throw err;
//         }
//     };
//     const createPeerConnection = (stream: MediaStream) => {
//         const peerConnection = new RTCPeerConnection({
//             iceServers: [
//                 { urls: "stun:stun.l.google.com:19302" },
//                 { urls: "stun:stun1.l.google.com:19302" }
//             ]
//         });
//         // Add all tracks from the local stream to the peer connection
//         stream.getTracks().forEach((track) => {
//             peerConnection.addTrack(track, stream);
//         });

//         // Handle incoming remote streams
//         peerConnection.ontrack = (event) => {
//             const [remoteStream] = event.streams;
//             if (remoteVideoRef.current) {
//                 remoteVideoRef.current.srcObject = remoteStream;
//             }
//         };

//         // Handle ICE candidates
//         peerConnection.onicecandidate = (event) => {
//             if (event.candidate && socketRef.current) {
//                 socketRef.current.emit("ice-candidate", {
//                     candidate: event.candidate,
//                     senderId: senderId!,
//                     receiverId
//                 });
//             }
//         };

//         // Log connection state changes for debugging
//         peerConnection.oniceconnectionstatechange = () => {
//             console.log("ICE connection state:", peerConnection.iceConnectionState);
//         };

//         peerConnection.onsignalingstatechange = () => {
//             console.log("Signaling state:", peerConnection.signalingState);
//         };

//         peerConnectionRef.current = peerConnection;
//         return peerConnection;
//     };
//     useEffect(() => {
//         const socket = getSocket();
//         if (!socket || !senderId || !receiverId) return;
//         socketRef.current = socket

//         const cleanups = rtcSocketEvents({ socket, peerConnectionRef, remoteVideoRef, senderId, receiverId });
//         return () => {


//             if (peerConnectionRef.current) {
//                 peerConnectionRef.current.close()
//             };
//             if (localVideoStreamRef.current) {
//                 localVideoStreamRef.current.getTracks().forEach(track => track.stop())
//             }
//             if (localVideoRef.current) {
//                 localVideoRef.current.srcObject = null
//             };
//             if (remoteVideoRef.current) {
//                 remoteVideoRef.current.srcObject = null;
//             }
//             cleanups()

//         }

//     }, [localVideoRef, remoteVideoRef, peerConnectionRef]);
//     return { localVideoRef, remoteVideoRef, localVideoStreamRef, closeVideoCall, audio, video, toggleAudio, toggleVideo, initLocalStream, createPeerConnection }

// }
// export default useWebRtc


// /*
// User A emits the calling event to User B
// User B accepts the call and emits the acceptedCall event when that happens
// then on user A we lisiten for accepedCall event then emit offer event is this way i should not have
// to explicitly listen for handleOffer or handleAnswer . am i right or worng?


// */