import { ISocket } from "../../types/socket.types";

interface InitProps {
    peerConnectionRef: React.RefObject<RTCPeerConnection | null>,
    localVideoRef: React.RefObject<HTMLVideoElement | null>,
    remoteVideoRef: React.RefObject<HTMLVideoElement | null>,
    localVideoStreamRef: React.RefObject<MediaStream | null>
    socket: ISocket;
    senderId: string;
    receiverId: string;

}

async function init({ socket, peerConnectionRef, localVideoRef, remoteVideoRef, localVideoStreamRef, senderId, receiverId }: InitProps) {

    console.log("iniside init")
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const peerConnection = new RTCPeerConnection();
    stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
    });
    peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit("ice-candidate", { candidate: event.candidate, senderId, receiverId });
        }
    }

    if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
    };
    localVideoStreamRef.current = stream;

    peerConnectionRef.current = peerConnection;

};

export default init