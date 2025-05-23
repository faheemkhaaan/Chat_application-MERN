import { model, Schema, Document, Types } from "mongoose";

export interface IChat extends Document {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    messages: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const chatSchema = new Schema<IChat>({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message",
        required: true
    }]
}, {
    timestamps: true
});

const Participant = model<IChat>("Participant", chatSchema);

export default Participant