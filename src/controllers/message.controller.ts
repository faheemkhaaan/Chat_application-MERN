
import { Request, Response } from "express";
import Message from "../models/message.model";
import { asyncWrapper } from "../utils/asyncWrapper";
import Chat from "../models/chat.model";
import { handleClientError } from "../utils/errorHandler";
import { io } from "../socket/socket";
import User from "../models/user.model";
import cloudinary from "../config/cloudinary";
import { matchedData, validationResult } from "express-validator";

export const sendMessage = asyncWrapper(async (req: Request, res: Response) => {
    const { message } = req.body;
    const { receiverId } = req.params;
    // console.log(receiverId)
    const senderId = (req as any).user._id;
    if (!message || !receiverId || !senderId) {
        res.status(400).json({
            success: false,
            message: "Missing required fields: message, receiverId, or user not authenticated"
        });
        return
    }

    // Start a MongoDB session for transactions

    try {
        // Create the new message (don't save yet)
        const newMessage = new Message({
            message,
            senderId,
            receiverId
        });

        // Find or create conversation and add message
        let conversation = await Chat.findOne(
            {
                $or: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            },
        );

        if (!conversation) {
            conversation = new Chat({
                senderId,
                receiverId,
                messages: []
            })
        }

        conversation.messages.push(newMessage._id)
        // Save the message within the same transaction
        await newMessage.save();
        await conversation.save()

        const receiverSocketId = await User.findById(receiverId)
        if (receiverSocketId?.socketId) {
            io.to(receiverSocketId.socketId).emit("message:send", { message: newMessage, id: conversation.id });
        }

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: {
                messageId: newMessage._id,
                conversationId: conversation._id
            }
        });

    } catch (error) {
        console.error("Error in sendMessage:", error);
        throw error; // This will be caught by asyncWrapper
    }
}, "sendMessage")


export const getMessages = asyncWrapper(async (req: Request, res: Response) => {
    const { receiverId } = req.params;
    const senderId = (req as any).user._id;
    console.log(receiverId)
    if (!receiverId && senderId) {
        handleClientError(res, 404, "Missing required parameters: receiverId or user not authenticated");
        return;
    }
    const conversation = await Chat.findOne({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
        ]
    }).populate({
        path: "messages",
        populate: {
            path: "senderId receiverId",
            select: "username email"
        }
    });
    if (!conversation) {
        res.status(200).send({
            success: true,
            messages: []
        })
        return
    }


    res.status(200).json({ success: true, conversation: { id: conversation._id, messages: conversation?.messages } })
}, "getMessages")


export const getPreviews = asyncWrapper(async (req: Request, res: Response) => {
    const userId = req?.user?._id;

    if (!userId) {
        handleClientError(res, 404, "User id is required");
        return;
    }
    // Find all conversations the current user is part of
    const conversations = await Chat.find({
        $or: [{ senderId: userId }, { receiverId: userId }]
    }).populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 }, // just the last message
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

        return {
            _id: convo._id,
            userId: otherUser,
            lastMessage: convo.messages[0] || null,
            unreadCount
        };
    }));

    res.status(200).send({ success: true, conversations: results });
}, "getPreviews");

export const uploadMessageImage = asyncWrapper(async (req: Request, res: Response) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }

    try {
        const files = req.files as Express.Multer.File[];

        const uploadPromises = files.map(file => {
            return new Promise<string>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "messages_media" },
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error("Upload result is undefined"));
                        resolve(result.secure_url);
                    }
                );

                uploadStream.end(file.buffer);
            });
        });

        const uploadedUrls = await Promise.all(uploadPromises);

        return res.status(200).json({ imageUrls: uploadedUrls });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ message: "Failed to upload image(s)" });
    }
}, "uploadMessageImage");

export const deleteMessage = asyncWrapper(async (req: Request, res: Response) => {

    const { receiverId, id } = matchedData(req);
    console.log(receiverId, id)
    const userId = req.user?.id
    const foundMessage = await Message.findById(id);
    if (!foundMessage) {
        handleClientError(res, 404, "Message with id does not exist");
        return;
    }
    foundMessage.content = {};
    foundMessage.isDeleted = true;
    await foundMessage.save();
    try {
        const receiver = await User.findById(receiverId);
        if (receiver?.socketId) {
            io.to(receiver.socketId).emit("message:deleted", { message: foundMessage, senderId: userId });
        }
    } catch (socketError) {
        console.error("Failed to emit deletion event:", socketError);
        // You might want to handle this differently
    }
    res.status(200).json({ message: "Message deleted successfully", updatedMessage: foundMessage });

}, "deleteMessage");

export const addReaction = asyncWrapper(async (req: Request, res: Response) => {
    const { messageId, receiverId, emoji } = req.body;
    const userId = req.user?.id;
    const foundMessage = await Message.findById(messageId);
    if (!foundMessage) {
        handleClientError(res, 400, "Message with id does not exist");
        return;
    }
    if (foundMessage.isDeleted) {
        handleClientError(res, 400, "The message is deleted");
        return;
    }

    const receiverSocketId = await User.findById(receiverId);
    foundMessage.reactions.set(userId, emoji)
    await foundMessage.save()

    if (receiverSocketId) {
        io.to(receiverSocketId.socketId).emit("message:reactions", { message: foundMessage, id: userId });
    }
    res.status(200).json({ updatedMessage: foundMessage });
}, "addReaction")
export const fetchUsersMessages = asyncWrapper(async (req: Request, res: Response) => {
    const conversations = await Chat.find().populate({
        path: "messages",
        populate: [
            {
                path: "senderId", select: "_id username email profilePicture",
            },
            {
                path: "receiverId", select: "_id username email profilePicture",
            },
        ]
    }).populate({ path: "senderId receiverId", select: "_id username" });
    const formatedConversation = conversations.map(convo => ({
        _id: convo._id,
        participant: {
            sender: convo.senderId,
            receiverId: convo.receiverId,
        }
    }))

}, "fetchUsersMessages")