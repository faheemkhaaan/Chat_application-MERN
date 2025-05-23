export type User = {
    _id: string;
    username: string;
    email: string;
    picture: string;
    bio: string;
    status: "online" | "offline" | "away" | "busy";
    lastSeen: Date;
    phone: string;
    dob?: Date;
    friends: string[];
    groups: string[];
    adminGroup: string[];
    socketId: string;
    deviceInfo: string;
    isVerified: boolean;
    notificationsEnabled: boolean;
    pushToken: string;
    links: {
        _id: string;
        url: string;
        title: string;
    }[];
    settings: {
        theme: "light" | "dark";
        language: string;
    };
    createdAt: Date;
    updatedAt: Date;
    blockedUsers: {
        user: {
            _id: string,
            username: string,
            picture: string
        },
        _id: string,
        blockAt: Date
    }[],
    blockedBy: {
        user: {
            _id: string;
            username: string;
            picture: string;
        },
        blockedAt: Date
    }[]
}
export type Message = {
    _id: string;
    senderId: User;
    receiverId: User;
    content: {
        text?: string;
        imageUrls?: string[];
    };
    isDeleted: boolean;
    reactions: Record<string, string>;
    status: "sent" | "delivered" | "read"
    createdAt: string;
    updatedAt: string;
    __v: number;
}
export interface MessagesState {
    loading: boolean;
    messages: { [conversationId: string]: Message[] };
    conversationMap: { [userId: string]: string };
    error: undefined | string;
}
export interface Conversation {
    id: string;
    messages: Message[];
}

export interface AuthInitialState {
    user: User | null;
    authenticated: boolean;
    loading: boolean;
    error?: {
        success: boolean,
        errors: { [fieldName: string]: string }
    } | null;
};
export interface LoginResponse {
    user: User
}

export interface Group {
    _id: string;
    name: string;
    description?: string;
    creator: User;
    admins: User[];
    members: User[];
    messages: Message[];
    pendingRequests: User[];
    avatar?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface GroupInitialState {
    groups: {
        [groupId: string]: Group;
    };
    groupPreviews: Group[]; // For sidebar list
    loading: boolean,
    error: string | null
}

export type ResponseFetchUsers = {
    users: User[]
}
