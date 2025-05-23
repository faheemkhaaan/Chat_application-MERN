import { Document, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    picture: string;
    picturePublicId?: string;
    bio: string;
    status: "online" | "offline" | "away" | "busy";
    lastSeen: Date;
    phone: string;
    dob?: Date;
    friends: Types.ObjectId[];
    groups: Types.ObjectId[];
    adminGroups: Types.ObjectId[];
    socketId: string;
    isVerified: boolean;
    notificationsEnabled: boolean;
    pushToken: string;
    settings: {
        theme: "light" | "dark";
        language: string;
    };
    comparePassword: (hashPassword: string) => Promise<boolean>;
    blockedUsers: {
        user: Types.ObjectId,
        blockAt: Date,
    }[];
    blockedBy: {
        user: Types.ObjectId,
        blockedAt: Date,
    }[],
    emailVerificationToken: String | null,
    emailVerificationExpires: Date | null,
    passwordResetToken: String,
    passwordRestTokenExpires: Date;
    links: Array<{
        url: string;
        title?: string;
        icon?: string;
    }>
}
