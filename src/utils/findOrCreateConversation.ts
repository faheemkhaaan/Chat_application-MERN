import Chat from '../models/chat.model'
export const findOrCreateConversation = async (senderId: string, receiverId: string) => {
    let conversation = await Chat.findOne({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
        ],
    });
    if (!conversation) {
        conversation = new Chat({
            senderId,
            receiverId,
            messages: []
        });
    }
    return conversation
}