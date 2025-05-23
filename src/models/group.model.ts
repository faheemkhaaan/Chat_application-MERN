import { model, Schema, Document, Types } from "mongoose";

export interface IGroup extends Document {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    creator: Types.ObjectId; // User who created the group
    admins: Types.ObjectId[]; // Array of admin User IDs
    members: Types.ObjectId[]; // Array of member User IDs
    messages: Types.ObjectId[]; // References to Message model
    pendingRequests: Types.ObjectId[],
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

const groupSchema = new Schema<IGroup>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        admins: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                default: [],
            },
        ],
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: "Message",
                default: [],
            },
        ],
        pendingRequests: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                default: []
            }
        ],
        avatar: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Group = model<IGroup>("Group", groupSchema);
export default Group;