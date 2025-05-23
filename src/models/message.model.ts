import { model, Schema, Types } from "mongoose";
export interface IMessage extends Document {
    _id: Types.ObjectId;
    senderId: Types.ObjectId;
    receiverId?: Types.ObjectId;
    groupId?: Types.ObjectId;
    content: {
        text?: string;
        imageUrl?: string[];
    };
    status: 'sent' | 'delivered' | 'read';
    isDeleted: boolean;
    reactions: Map<string, string>;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}
const messageSchema = new Schema<IMessage>({
    content: {
        text: { type: String },
        imageUrls: [{ type: String }],
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: "Group"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    reactions: {
        type: Map,
        of: String,
        default: new Map()
    },
    status: {
        type: String,
        enum: ["sent", "delivered", "read"],
        default: "sent"
    }
}, {
    timestamps: true
})

messageSchema.pre<IMessage>("save", function (next) {
    if (!this.receiverId && !this.groupId) {
        throw new Error("Message must have receiverId or groupId")
    }
    next()
})

const Message = model("Message", messageSchema);

export default Message