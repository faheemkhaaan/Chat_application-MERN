import { Socket } from "socket.io-client";
import { Group, Message, User } from "./slice.types";
interface WebRTCOffer {
    offer: RTCSessionDescriptionInit;
    senderId: string;
    receiverId?: string; // For client-to-server
}

interface WebRTCAnswer {
    answer: RTCSessionDescriptionInit;
    senderId: string;
    receiverId?: string; // For client-to-server
}

interface WebRTCIceCandidate {
    candidate: RTCIceCandidateInit;
    senderId: string;
    receiverId?: string; // For client-to-server
}
export interface UserPair {
    senderId: string;
    receiverId: string;
}
export interface ServerToClientEvents {
    "message:send": ({ message, id }: { message: Message, id: string }) => void;
    "conversationPreviews": ({ success, conversations }: {
        success: boolean, conversations: {
            _id: string,
            userId: string,
            lastMessage: Message | null,
            unreadCount: number
        }[]
    }) => void,
    "server-error": ({ message, error }: { message: string, error: Error }) => void;
    "messageRead": ({ conversationId, id, receiverId, senderId, status, }: { conversationId: string; id: string; receiverId: string; senderId: string; status: "sent" | "delivered" | "read" }) => void,
    "authentication error": ({ message }: { message: string }) => void;
    "connect": () => void;
    "disconnect": () => void;
    "messageDeleivered": ({ message, id }: { message: Message, id: string }) => void;
    "requestOnlineUsers": () => void;
    "onlineUsers": (onlineUsers: string[]) => void;
    "getAuthUser": (user: User) => void;
    "receivedMessageToGroup": (group: Group) => void;
    "groupDeleted": () => void;
    "groupUpdated": () => void;
    "groupCreated": () => void;
    "leftGroup": () => void;
    "requestApproved": () => void;
    "offer": (params: WebRTCOffer) => void;
    "answer": (params: WebRTCAnswer) => void;
    "ice-candidate": (params: WebRTCIceCandidate) => void;
    "ready": () => void;
    "leave": () => void;
    "join": () => void;
    "call:initiate": ({ senderId, receiverId }: { senderId: string, receiverId: string }) => void;
    "call:reject": ({ senderId, receiverId }: { senderId: string, receiverId: string }) => void;
    "call:accept": ({ senderId, receiverId }: { senderId: string, receiverId: string }) => void;
    "ringing": ({ senderId }: { senderId: string }) => void;
    "call:end": () => void;
    "message:deleted": ({ message, senderId }: { message: Message, senderId: string }) => void;
    "message:reactions": ({ message, id }: { message: Message, id: string }) => void;
    "typing:start": ({ senderId }: { senderId: string }) => void,
    "typing:stop": ({ senderId }: { senderId: string }) => void,

}
export interface ClientToServerEvents {
    "message:send": ({ senderId, receiverId, content }: { senderId: string; receiverId: string; content: string }) => void;
    "conversationPreviews": ({ conversationId }: { conversationId: string }) => void;
    "server-error": () => void;
    "messageRead": () => void,
    "requestOnlineUsers": () => void;
    "createGroup": ({ name, description, avatar, admins, members, creator }: { name: string; description: string; avatar?: string; admins?: string[], members?: string[], creator: string }) => void;
    "selectedChat": ({
        conversationId,
        userId
    }: { conversationId: string, userId: string }) => void;
    "user:block": (id: string) => void;
    "user:unblock": (id: string) => void;
    "group:fetch": (callback?: (res: Group[]) => void) => void;
    "sendMessageToGroup": ({ receiverId, senderId, content }: { receiverId: string, senderId: string, content: string }) => void;
    "sendImages": ({ senderId, receiverId, images }: { senderId: string, receiverId: string; images: string[] }, callback?: (ack: string) => void) => void;
    "offer": (params: WebRTCOffer) => void;
    "answer": (params: WebRTCAnswer) => void;
    "ice-candidate": (params: WebRTCIceCandidate) => void;
    "ready": () => void;
    "leave": () => void;
    "join": () => void;
    "call:initiate": ({ senderId, receiverId }: { senderId: string, receiverId: string }) => void;
    "call:reject": ({ senderId, receiverId }: { senderId: string, receiverId: string }) => void;
    "call:accept": ({ senderId, receiverId }: { senderId: string, receiverId: string }) => void;
    "call:end": ({ senderId, receiverId }: { senderId: string, receiverId: string }) => void;
    "typing:stop": ({ senderId, receiverId }: { senderId: string; receiverId: string }) => void;
    "typing:start": ({ senderId, receiverId }: { senderId: string; receiverId: string }) => void;
}

export type ISocket = Socket<ServerToClientEvents, ClientToServerEvents>