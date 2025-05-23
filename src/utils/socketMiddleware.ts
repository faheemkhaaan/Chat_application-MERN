// utils/socketMiddleware.ts
import { Socket } from "socket.io";
import User from "../models/user.model";
import { ISocket } from "../types/socket.types";

export async function checkBlockedMiddleware(
    socket: ISocket,
    next: (err?: Error) => void,
    { senderId, receiverId }: { senderId: string; receiverId: string }
) {
    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return next(new Error("User not found"));
        }

        // Check if sender has blocked receiver
        if (sender.blockedUsers.some(blocked => blocked.user.equals(receiverId))) {
            return next(new Error("You have blocked this user"));
        }

        // Check if sender is blocked by receiver
        if (receiver.blockedUsers.some(blocked => blocked.user.equals(senderId))) {
            return next(new Error("You are blocked by this user"));
        }

        next();
    } catch (error) {
        next(new Error("Error checking blocked status"));
    }
}