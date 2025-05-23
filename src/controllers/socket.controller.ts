import Message, { IMessage } from "../models/message.model";
import { io } from "../socket/socket";
import Chat from '../models/chat.model'
import User from "../models/user.model";
import { findOrCreateConversation } from "../utils/findOrCreateConversation";
import { Socket } from "socket.io";
import { ClientToServerEvents, ISocket, SendImageCallBack, SendImagesParams, ServerToClientEvents } from "../types/socket.types";
import withBlockedCheck from "../utils/handlerWrapper";
type PrivateMessagePayload = {
    message: IMessage;
    id: string;
};

async function checkBlockedStatus(socket: Socket<ClientToServerEvents, ServerToClientEvents>, { senderId, receiverId }: { senderId: string, receiverId: string }) {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (sender && sender.blockedUsers.some(blockedUsers => blockedUsers.user.equals(receiverId))) {
        socket.emit("server-error", { message: "User is blocked, can't send message", error: new Error("User is blocked") });
        return true;
    } else if (sender && sender.blockedBy.some(users => users.user.equals(receiverId))) {
        socket.emit("server-error", { message: "You have been blocked by the user", error: new Error("You are blocked by the user") });
        return true;
    }
    if (receiver && receiver.blockedUsers.some(blockedUsers => blockedUsers.user.equals(senderId))) {
        socket.emit("server-error", { message: "User is blocked, can't send message", error: new Error("User is blocked") });
        return true;
    } else if (receiver && receiver.blockedBy.some(users => users.user.equals(senderId))) {
        socket.emit("server-error", { message: "You have been blocked by the user", error: new Error("You are blocked by the user") });
        return true;
    }
    return false
}
export const handlePrivateMessage = withBlockedCheck(async (socket: Socket<ClientToServerEvents, ServerToClientEvents>, { senderId, receiverId, content }: { senderId: string; receiverId: string; content: string }) => {
    try {
        const newMessage = new Message({
            senderId,
            receiverId,
            content: {
                text: content
            }
        });
        let conversation = await findOrCreateConversation(senderId, receiverId)
        conversation.messages.push(newMessage._id);
        await Promise.all([newMessage.save(), conversation.save()]);

        const populatedMessage = await newMessage.populate([
            { path: "senderId", select: "username email" },
            { path: "receiverId", select: "username email" }
        ]);
        const receiverSocketId = await User.findById(receiverId);

        if (receiverSocketId?.socketId) {
            io.to(receiverSocketId.socketId).emit("message:send", { message: populatedMessage.toObject(), id: conversation.id.toString() });
            await Message.updateOne(
                { _id: newMessage._id },
                { $set: { status: "delivered" } }
            );
            populatedMessage.status = "delivered"

            socket.emit("messageDeleivered", { message: populatedMessage.toObject(), id: conversation.id.toString() });
            // console.log(`Message sent from ${senderId} to ${receiverId}`);
        } else {
            socket.emit("message:send", { message: populatedMessage.toObject(), id: conversation.id.toString() });
        }
        // console.log(`Message sent from ${senderId} to ${receiverId}`);
    } catch (error: any) {
        socket.emit("server-error", {
            message: "Something went wrong!",
            error: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : error) : new Error("Internal server error")
        });
    }
});



export const hanldeSelectedChat = async (socket: any, { conversationId, userId }: { conversationId: string, userId: string }) => {
    try {

        const conversation = await Chat.findById(conversationId).populate<{ messages: IMessage[] }>('messages');

        if (!conversation) return;

        const populatedMessages = conversation.messages as IMessage[]

        // // Get message IDs that are not marked as "read"
        const unreadMessageIds = populatedMessages
            .filter(msg => msg.status !== 'read' && msg.receiverId?.toString() === userId)
            .map(msg => msg._id);


        if (unreadMessageIds.length > 0) {
            await Message.updateMany(
                { _id: { $in: unreadMessageIds } },
                { $set: { status: 'read' } }
            );

            // Optionally: Notify the sender that their messages have been read
            unreadMessageIds.forEach(async msgId => {
                const message = conversation.messages.find(m => m._id.toString() === msgId.toString());
                if (message) {
                    const senderSocketId = await User.findById(message.senderId);
                    if (senderSocketId?.socketId) {
                        io.to(senderSocketId.socketId).emit("messageRead", {
                            conversationId,
                            id: msgId.toString(),
                            senderId: message.senderId.toString(),
                            receiverId: message.receiverId?.toString()!,
                            status: 'read'
                        });

                    }
                }
            });
        }
    } catch (error) {
        console.error("Error updating messages to read:", error);
        socket.emit("server-error", {
            message: "Failed to mark messages as read",
            error: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : error) : undefined
        });
    }
}

export const handleTyping = async (socket: ISocket, { senderId, receiverId }: { senderId: string, receiverId: string }) => {
    const receiverSocketId = await User.findById(receiverId);
    if (await checkBlockedStatus(socket, { senderId, receiverId })) {
        return
    }
    // console.log(receiverId)
    if (receiverSocketId?.socketId) {
        console.log(senderId, 'Is TYPING RIGHT NOW ')
        io.to(receiverSocketId.socketId).emit("typing:start", { senderId })
    }
}

export const hanldeStopTyping = async (socket: ISocket, { senderId, receiverId }: { senderId: string, receiverId: string }) => {
    if (await checkBlockedStatus(socket, { senderId, receiverId })) {
        return
    }
    const receiverSocketId = await User.findById(receiverId);
    if (receiverSocketId?.socketId) {
        io.to(receiverSocketId.socketId).emit("typing:stop", { senderId })
    }
}


export async function emitConversationPreviews(userId: string) {
    try {
        // Reuse your existing getConversation logic
        const conversations = await Chat.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).populate({
            path: "messages",
            options: { sort: { createdAt: -1 }, limit: 1 },
            populate: {
                path: "senderId receiverId",
                select: "username"
            }
        });

        const results = await Promise.all(conversations.map(async convo => {
            const otherUser = convo.senderId.toString() === userId.toString() ? convo.receiverId : convo.senderId;
            const unreadCount = await Message.countDocuments({
                senderId: otherUser,
                receiverId: userId,
                status: { $in: ["sent", "delivered"] }
            });
            const lastMessage = convo.messages[0] as unknown as IMessage | null

            return {
                _id: convo._id ? convo._id.toString() : "",
                userId: otherUser.toString(),
                lastMessage,
                unreadCount
            };
        }));

        // Get the socket ID for this user
        const socketId = await User.findById(userId);
        if (socketId?.socketId) {
            io.to(socketId.socketId).emit('conversationPreviews', {
                success: true,
                conversations: results
            });
        }
    } catch (error) {
        console.error('Error emitting conversation previews:', error);
    }
}


export const sendImages = async (socket: ISocket, { senderId, receiverId, images }: SendImagesParams, callback?: (ack: string) => void) => {


    if (!senderId || !receiverId || images.length === 0) return;
    if (await checkBlockedStatus(socket, { senderId, receiverId })) {
        return;
    }
    try {
        const newMessage = new Message({ senderId, receiverId, content: { imageUrls: images } })
        const conversation = await findOrCreateConversation(senderId, receiverId);
        conversation.messages.push(newMessage._id);
        await Promise.all([newMessage.save(), conversation.save()]);
        const populateMessage = await newMessage.populate([
            { path: "senderId", select: "username email" },
            { path: "receiverId", select: "username email" }
        ])
        const receiverSocketId = await User.findById(receiverId);
        if (receiverSocketId?.socketId) {
            io.to(receiverSocketId.socketId).emit('message:send', { message: populateMessage.toObject(), id: conversation.id.toString() });
            await Message.updateOne(
                { _id: newMessage._id },
                { $set: { status: "delivered" } }
            );
            populateMessage.status = "delivered";
            socket.emit("messageDeleivered", { message: populateMessage.toObject(), id: conversation.id.toString() });
            return
        }
        socket.emit("message:send", { message: populateMessage.toObject(), id: conversation.id.toString() });
        if (!callback) return;
        callback("Good we got the images")
    } catch (error: any) {
        socket.emit("server-error", { message: "Faild to save Images", error })
    }
}