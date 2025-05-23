// src/services/socketEmitter.service.ts
import { getSocket } from "./socket.service";
import { UserPair } from "../../types/socket.types"; // Define this type
import { Group } from "../../types/slice.types";

class SocketEmitter {
    private static instance: SocketEmitter;
    private socket = getSocket();

    private constructor() { }

    public static getInstance(): SocketEmitter {
        if (!SocketEmitter.instance) {
            SocketEmitter.instance = new SocketEmitter();
        }
        return SocketEmitter.instance;
    }

    // User Actions
    blockUser(userId: string) {
        this.socket?.emit("user:block", userId);
    }

    unblockUser(userId: string) {
        this.socket?.emit("user:unblock", userId);
    }

    // Typing Indicators
    startTyping(pair: UserPair) {
        this.socket?.emit("typing:start", pair);
    }

    stopTyping(pair: UserPair) {
        this.socket?.emit("typing:stop", pair);
    }

    // Call Management
    startCall(pair: UserPair) {
        this.socket?.emit("call:initiate", pair);
    }

    acceptCall(pair: UserPair) {
        this.socket?.emit("call:accept", pair);
    }

    rejectCall(pair: UserPair) {
        this.socket?.emit("call:reject", pair);
    }

    endCall(pair: UserPair) {
        this.socket?.emit("call:end", pair);
    }

    // Group Actions
    fetchGroups(callback?: (groups: Group[]) => void) {
        this.socket?.emit("group:fetch", callback);
    }

}

export default SocketEmitter.getInstance();