// socket.types.ts
import { Socket } from "socket.io";
import { Types } from "mongoose";
import { IMessage } from "../models/message.model";
import { IUser } from "./model.types";
import { IGroup } from "../models/group.model";
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

interface PeerIds {
    senderId: string;
    receiverId: string;
}
export interface ServerToClientEvents {
    "requestApproved": () => void;
    "leftGroup": () => void;
    "groupCreated": () => void;
    "groupUpdated": () => void;
    "groupDeleted": () => void;
    "message:send": ({ message, id }: { message: IMessage, id: string }) => void;
    "conversationPreviews": ({ success, conversations }: {
        success: boolean, conversations: {
            _id: string,
            userId: string,
            lastMessage: IMessage | null,
            unreadCount: number
        }[]
    }) => void,
    "server-error": ({ message, error }: { message: string, error: Error }) => void;
    "messageRead": ({ conversationId, id, receiverId, senderId, status, }: { conversationId: string; id: string; receiverId: string; senderId: string; status: string }) => void,
    "authentication error": ({ message }: { message: string }) => void;
    "connect": () => void;
    "disconnect": () => void;
    "messageDeleivered": ({ message, id }: { message: IMessage, id: string }) => void;
    "requestOnlineUsers": () => void;
    "onlineUsers": (onlineUsers: { _id: Types.ObjectId, status: string }[]) => void,
    "typing:start": ({ senderId }: { senderId: string }) => void,
    "typing:stop": ({ senderId }: { senderId: string }) => void,
    "getAuthUser": (user: IUser) => void;
    "getGroups": ({ groups }: { groups: IGroup }) => void;
    "receivedMessageToGroup": (group: IGroup) => void;
    "offer": (params: WebRTCOffer) => void;
    "answer": (params: WebRTCAnswer) => void;
    "ice-candidate": (params: WebRTCIceCandidate) => void;
    "ready": () => void;
    "leave": () => void;
    "join": () => void;
    "ringing": ({ senderId }: { senderId: string }) => void;
    "call:accept": ({ senderId, receiverId }: PeerIds) => void;
    "call:reject": ({ senderId, receiverId }: { senderId: string, receiverId: string }) => void;
    "call:end": () => void;
    "message:deleted": ({ message, senderId }: { message: IMessage, senderId: string }) => void;
    "message:reactions": ({ message, id }: { message: IMessage, id: string }) => void;
}
export interface ClientToServerEvents {
    "sendImages": ({ senderId, receiverId, images }: { senderId: string, receiverId: string; images: string[] }, callback?: (ack: string) => void) => void;
    "requestConversationsPreviews": (userId: string) => void;
    "typing:stop": ({ senderId, receiverId }: PeerIds) => void;
    "typing:start": ({ senderId, receiverId }: PeerIds) => void;
    "selectedChat": ({ conversationId, userId }: { conversationId: string, userId: string }) => void;
    "user:block": (id: string) => void;
    "user:unblock": (id: string) => void;
    "message:send": ({ senderId, receiverId, content }: { senderId: string; receiverId: string; content: string }) => void;
    "conversationPreviews": ({ conversationId }: { conversationId: string }) => void;
    "server-error": () => void;
    "messageRead": () => void,
    "requestOnlineUsers": () => void;
    "group:fetch": (callBack?: (response: IGroup[]) => void) => void;
    "triggerGetGroups": () => void;
    "sendMessageToGroup": ({ receiverId, senderId, content }: { receiverId: string, senderId: string, content: string }) => void;
    "createGroup": ({ name, description, avatar, admins, members, creator }: { name: string; description: string; avatar?: string; admins?: string[], members?: string[], creator: string }) => void;
    "offer": (params: WebRTCOffer) => void;
    "answer": (params: WebRTCAnswer) => void;
    "ice-candidate": (params: WebRTCIceCandidate) => void;
    "call:initiate": ({ senderId, receiverId }: { senderId: string, receiverId: string }) => void;
    "leave": () => void;
    "join": () => void;
    "call:accept": ({ senderId, receiverId }: { senderId: string, receiverId: string }) => void;
    "call:reject": ({ senderId, receiverId }: { senderId: string, receiverId: string }) => void;
    "call:end": ({ senderId, receiverId }: { senderId: string, receiverId: string }) => void;
}
export interface SendImagesParams {
    senderId: string;
    receiverId: string;
    images: string[];
}
export interface SendImageCallBack {
    callback?: (ack: string) => void;
}

export interface TypingParams {
    senderId: string;
    receiverId: string;
}

export interface SelectedChatParams {
    conversationId: string;
    userId: string;
}

export interface CreateGroupParams {
    name: string;
    description: string;
    avatar?: string;
    admins?: string[];
    members?: string[];
    creator: string;
}

export type ISocket = Socket<ClientToServerEvents, ServerToClientEvents>;
