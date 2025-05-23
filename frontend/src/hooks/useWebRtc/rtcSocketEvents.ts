// rtcSocketEvents.ts
import { ISocket } from "../../types/socket.types";

interface RtcSocketEvents {
    peerConnectionRef: React.RefObject<RTCPeerConnection | null>,
    remoteVideoRef: React.RefObject<HTMLVideoElement | null>,
    socket: ISocket;
    senderId: string;
    receiverId: string;
}

function checkPeerConnection(pc: RTCPeerConnection | null, event: string) {
    if (!pc) {
        console.log(`Peerconnection is null during ${event}`, pc);
        return false;
    }
    if (pc.signalingState === 'closed') {
        console.log(`peerconection is closed during ${event}`, pc.signalingState);
        return false;
    }
    return true; // Return true if connection is valid
}

function rtcSocketEvents({ socket, peerConnectionRef, senderId, receiverId }: RtcSocketEvents) {
    // console.log("Setting up RTC socket events");

    // When the caller receives call-accepted notification from the receiver
    socket.on("call:accept", async ({ senderId: calleeSenderId }) => {
        console.log(`Call accepted by ${calleeSenderId}, creating offer`);

        const pc = peerConnectionRef.current;
        if (!checkPeerConnection(pc, "call-accepted")) {
            console.error("Invalid peer connection in call-accepted");
            return;
        }
        if (!pc) return;

        try {
            // Create offer
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // Send offer to the callee (receiver)
            socket.emit("offer", {
                offer,
                senderId,  // Our ID (caller)
                receiverId // Receiver ID (callee)
            });

            // console.log('Offer created and sent:', offer);
        } catch (error) {
            console.error("Error creating offer:", error);
        }
    });

    // When the receiver gets an offer from the caller
    socket.on('offer', async ({ offer, senderId: callerSenderId }) => {
        // console.log(`Received offer from ${callerSenderId}`, offer);

        const pc = peerConnectionRef.current;
        if (!checkPeerConnection(pc, "offer")) {
            console.error("Invalid peer connection in offer");
            return;
        }
        if (!pc) return;

        try {
            // Set the remote description (the caller's offer)
            await pc.setRemoteDescription(new RTCSessionDescription(offer));

            // Create an answer
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            // Send the answer back to the caller
            socket.emit("answer", {
                answer,
                senderId,       // Our ID (receiver)
                receiverId: callerSenderId // Sender ID (caller)
            });

            // console.log('Answer created and sent:', answer);
        } catch (error) {
            console.error("Error handling offer:", error);
        }
    });

    // When the caller receives the answer from the receiver
    socket.on("answer", async ({ answer, senderId: calleeSenderId }) => {
        console.log(`Received answer from ${calleeSenderId}`, answer);

        const pc = peerConnectionRef.current;
        if (!checkPeerConnection(pc, "answer")) {
            console.error("Invalid peer connection in answer");
            return;
        }
        if (!pc) return;

        try {
            // Set the remote description (the receiver's answer)
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            // console.log("Remote description set successfully");
        } catch (error) {
            console.error("Error setting remote description:", error);
        }
    });

    // Handle ICE candidates from either side
    socket.on('ice-candidate', async ({ candidate }) => {
        // console.log(`Received ICE candidate from ${candidateSenderId}`, candidate);

        const pc = peerConnectionRef.current;
        if (!checkPeerConnection(pc, "ice-candidate")) {
            console.error("Invalid peer connection in ice-candidate");
            return;
        }
        if (!pc) return;

        try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
            console.log("ICE candidate added successfully");
        } catch (error) {
            console.error("Error adding ICE candidate:", error);
        }
    });

    // Return cleanup function
    return () => {
        console.log("Cleaning up RTC socket events");
        socket.off("answer");
        socket.off("offer");
        socket.off("ice-candidate");
        socket.off("call:accept");
    };
}

export default rtcSocketEvents;