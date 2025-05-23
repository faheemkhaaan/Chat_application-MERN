
import { Server, Socket } from 'socket.io';
import http from 'http'
import e from 'express';
import { emitConversationPreviews, handlePrivateMessage, handleTyping, hanldeSelectedChat, hanldeStopTyping, sendImages } from '../controllers/socket.controller';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socket.types';
import User from '../models/user.model';
import Message from '../models/message.model';
import Group from '../models/group.model';
import { Types } from 'mongoose';

const app = e()
const server = http.createServer(app);
const getOnlineUsers = async () => {
    const users = await User.find().select("_id status");
    return users;
}
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    },
    cookie: true,
    pingInterval: 10000,
    pingTimeout: 5000,
});

io.on("connection", async (socket) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
        socket.emit("authentication error", { message: "user not authenticated" });
        return;
    }

    await User.findByIdAndUpdate(userId, {
        status: "online",
        socketId: socket.id,
        lastSeen: null
    })

    socket.on("user:unblock", async (blockedUserId) => {
        try {
            await Promise.all([
                User.findByIdAndUpdate(userId, {
                    $pull: {
                        blockedUsers: { user: blockedUserId }
                    }
                }),
                User.findByIdAndUpdate(blockedUserId, {
                    $pull: {
                        blockedBy: { user: userId }
                    }
                })
            ]);
            const updatedUser = await User.findById(userId).populate([
                { path: "blockedUsers.user", select: "_id picture username" },
                { path: "blockedBy.user", select: "_id picture username" },
            ]);
            socket.emit("getAuthUser", updatedUser!);
        } catch (error: any) {
            socket.emit("server-error", { message: "Internal server error", error })
        }
    });

    socket.on("user:block", async (id) => {
        try {
            const user = await User.findById(userId);
            const userToBlock = await User.findById(id);
            if (!userToBlock) {
                socket.emit("server-error", { message: "User does not exist", error: new Error("User does not exist") })
                return;
            }

            const isAlreadyBlocked = user?.blockedUsers.some(b => b.user.toString() === id);
            if (isAlreadyBlocked) {
                socket.emit("server-error", { message: "User already blocked", error: new Error("User already blocked") })
                return;
            }
            await Promise.all([
                User.findByIdAndUpdate(user?._id, {
                    $push: {
                        blockedUsers: { user: id }
                    },
                    $pull: { friends: id }
                }),
                User.findByIdAndUpdate(id, {
                    $push: {
                        blockedBy: { user: user?._id }
                    },
                    $pull: { friends: user?._id }
                })
            ]);
            const updateUser = await User.findById(userId).populate([
                { path: "blockedUsers.user", select: "username picture _id" },
                { path: "blockedBy.user", select: "username picture _id" }
            ])
            socket.emit("getAuthUser", updateUser!);


        } catch (error: any) {
            socket.emit("server-error", { message: "Internal server error", error })
        }
    });



    await User.findByIdAndUpdate(userId, { status: "online", socketId: socket.id })
    io.emit("onlineUsers", await getOnlineUsers());
    await emitConversationPreviews(userId);
    socket.on("requestOnlineUsers", async () => {
        socket.emit("onlineUsers", await getOnlineUsers());
    });

    registerSocketEvents(socket, userId);
    const handleDisconnect = async () => {
        const user = await User.findById(userId);
        if (user?.socketId === socket.id) {
            await User.findByIdAndUpdate(userId, {
                status: "offline",
                lastSeen: new Date(),
                socketId: ""
            });
            io.emit("onlineUsers", await getOnlineUsers());
        }
    };
    socket.on('disconnect', handleDisconnect);
    socket.on("error", handleDisconnect);
    // socket.on("ping", (cb) => cb);
})
function registerSocketEvents(socket: Socket<ClientToServerEvents, ServerToClientEvents>, userId: string): void {
    socket.on("message:send", async (data) => {
        await handlePrivateMessage(socket, data);
        Promise.all([
            emitConversationPreviews(data.senderId),
            emitConversationPreviews(data.receiverId)
        ]).catch((err) => console.error("Preview update error:", err));
    });
    socket.on("sendMessageToGroup", async ({ receiverId, senderId, content }) => {
        if (!receiverId || !senderId || !content) return;
        try {
            const foundGroup = await Group.findById(receiverId);
            if (!foundGroup) {
                socket.emit("server-error", { message: "Group with id doest not exist", error: new Error("Group does not exists") });
                return;
            }
            if (!foundGroup.members.includes(new Types.ObjectId(senderId))) return;
            const newMessage = new Message({
                senderId,
                receiverId: foundGroup.id,
                content: {
                    text: content
                }
            });
            foundGroup.messages.push(newMessage.id);
            await Promise.all([foundGroup.save(), newMessage.save()]);
            const populatedGroup = await foundGroup.populate([
                { path: "creator", select: "-password -socketId -picturePublicId" },
                { path: "admins", select: "-password -socketId -picturePublicId" },
                { path: "members", select: "-password -socketId -picturePublicId" },
                {
                    path: "messages", populate: [
                        { path: "senderId", select: "-password -socketId -picturePublicId" }
                    ]
                }
            ]);
            io.emit("receivedMessageToGroup", populatedGroup);

        } catch (error: any) {
            console.error("Error sending message to group:", error);
            socket.emit("server-error", {
                message: "Error sending message",
                error
            });
        }
    })

    socket.on("group:fetch", async (callback) => {
        if (!callback) return;
        try {
            const groups = await Group.find().populate([
                { path: "creator", select: "-password -socketId -picturePublicId" },
                { path: "admins", select: "-password -socketId -picturePublicId" },
                { path: "members", select: "-password -socketId -picturePublicId" },
                { path: "pendingRequests", select: "username picture" },
                {
                    path: 'messages', populate: [
                        { path: "senderId", select: "-password -socketId -picturePublicId" }
                    ]
                }
            ]);
            callback(groups);
        } catch (error) {
            socket.emit("server-error", { message: "Internal server error", error: new Error("Internal server error") })
        }
    });

    socket.on("sendImages", (data, callback) => { sendImages(socket, data, callback) })
    socket.on("selectedChat", async (data) => {
        await hanldeSelectedChat(socket, data);
    });

    socket.on("typing:start", (data) => {
        handleTyping(socket, data);
    });

    socket.on("typing:stop", ({ senderId, receiverId }) => {
        hanldeStopTyping(socket, { senderId, receiverId });
    });

    socket.on("call:initiate", async ({ senderId, receiverId }) => {
        if (!senderId || !receiverId) return;
        const receiverSocketId = await User.findById(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId.socketId).emit("ringing", { senderId });
        }
    });
    socket.on('call:accept', async ({ senderId, receiverId }) => {
        if (!senderId || !receiverId) return;
        const receiverSocketId = await User.findById(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId.socketId).emit("call:accept", { senderId, receiverId });
        };
    });
    socket.on("call:end", async ({ senderId, receiverId }) => {
        if (!senderId || !receiverId) return;
        const receiverSocketId = await User.findById(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId.socketId).emit("call:end");
        };
    })

    socket.on("offer", async ({ offer, senderId, receiverId }) => {
        if (!senderId || !receiverId) return;
        const receiverSocketId = await User.findById(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId.socketId).emit("offer", { offer, senderId, receiverId })
        }
    });
    socket.on("answer", async ({ answer, senderId, receiverId }) => {

        if (!senderId || !receiverId) return;
        const receiverSocketId = await User.findById(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId.socketId).emit("answer", { answer, senderId, receiverId })
        }
    })
    socket.on("ice-candidate", async ({ candidate, senderId, receiverId }) => {
        if (!senderId || !receiverId) return;
        const receiverSocketId = await User.findById(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId.socketId).emit("ice-candidate", { candidate, senderId, receiverId });
        }
    });
    socket.on("call:reject", async ({ senderId, receiverId }) => {
        if (!senderId || !receiverId) return;
        const receiverSocketId = await User.findById(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId.socketId).emit("call:reject", { senderId, receiverId });
        }
    })

    // socket.on()
    socket.on("requestConversationsPreviews", async (userId) => {
        await emitConversationPreviews(userId);
    });


}




export { io, server, app };