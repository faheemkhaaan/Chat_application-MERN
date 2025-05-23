import { memo, useMemo, useState } from "react";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import UserAvatar from "./UserAvatar";
import { useAppSelector } from "../store/store";
import { format, isToday, isYesterday } from 'date-fns';
import { Message as IMessage } from '../types/slice.types'
import MessageActions from "./MessageActions";

interface MessageProps {
    message: IMessage;
    senderId: string | undefined;
    id: string;
    showDate?: boolean;
    onDelete: (messageId: string) => void;
    onReact: (messageId: string, emoji: string) => void;
}

const Message = memo(({ message, senderId, id, showDate, onDelete, onReact }: MessageProps) => {
    const selectedGroupId = useAppSelector(state => state.ui.selectedchatId.selectedGroupId);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const isOwnMessage = message.senderId._id === senderId;

    // Improved reaction display logic
    const reactions = useMemo(() => {
        if (!message.reactions) return null;

        // Group same emojis together with count
        const reactionGroups: Record<string, { emoji: string, count: number, userIds: string[] }> = {};

        Object.entries(message.reactions).forEach(([userId, emoji]) => {
            if (!reactionGroups[emoji]) {
                reactionGroups[emoji] = { emoji, count: 0, userIds: [] };
            }
            reactionGroups[emoji].count++;
            reactionGroups[emoji].userIds.push(userId);
        });

        return Object.values(reactionGroups);
    }, [message.reactions]);

    const statusIcon = useMemo(() => {
        if (!senderId || message.senderId._id !== senderId) return null;

        switch (message.status) {
            case 'sent':
                return <FaCheck className="text-gray-400" size={12} />;
            case 'delivered':
                return <FaCheckDouble className="text-gray-400" size={12} />;
            case 'read':
                return <FaCheckDouble className="text-green-500" size={12} />;
            default:
                return null;
        }
    }, [message.status, message.senderId._id, senderId]);

    const formatMessageTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, 'h:mm a');
        } catch (error) {
            return "";
        }
    };

    if (message.isDeleted) {
        return (
            <div className={`relative group ${isOwnMessage ? 'pl-10' : 'pr-10'}`}>
                <div
                    id={id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`flex items-center gap-1 relative h-[70px] rounded-lg ${isOwnMessage ? 'justify-end bg-red-50 pr-3' : 'justify-start bg-gray-50 pl-3'
                        } p-2 italic text-gray-500 text-sm border ${isOwnMessage ? 'border-red-100' : 'border-gray-200'
                        } max-w-xs md:max-w-md lg:max-w-lg`}>
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            This message was deleted
                        </span>
                        <span className="text-xs absolute right-3 bottom-2 text-gray-400">
                            {formatMessageDate(message.updatedAt)}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative group ${isOwnMessage ? 'pl-10' : 'pr-10'}`}>
            {showDate && (
                <div className="w-full flex justify-center my-4">
                    <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {formatMessageDate(message.createdAt)}
                    </div>
                </div>
            )}

            <div
                id={id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
                <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg relative rounded-lg p-3 ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'
                        }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {selectedGroupId && message.senderId._id !== senderId && (
                        <div className="flex items-center gap-2 mb-1">
                            <UserAvatar user={message.senderId} size="sm" />
                            <span className="text-xs font-semibold text-gray-700">
                                {message.senderId.username}
                            </span>
                        </div>
                    )}

                    {message.content?.text ? (
                        <div className="flex flex-col">
                            <p className="break-words">{message.content.text}</p>
                            <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${message.senderId._id === senderId ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                <span>{formatMessageTime(message.createdAt)}</span>
                                {statusIcon}
                            </div>
                        </div>
                    ) : message.content?.imageUrls && message.content.imageUrls.length !== 0 ? (
                        <div className="space-y-2">
                            {message.content.imageUrls.map((image, index) => (
                                <div key={index} className="rounded-lg overflow-hidden">
                                    <img
                                        className="w-full h-auto max-h-64 object-cover"
                                        src={image}
                                        alt={`Attachment ${index + 1}`}
                                    />
                                </div>
                            ))}
                            <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${message.senderId._id === senderId ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                <span>{formatMessageTime(message.createdAt)}</span>
                                {statusIcon}
                            </div>
                        </div>
                    ) : null}

                    {reactions && reactions.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap justify-end">
                            {reactions.map((reaction, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center rounded-full px-2 py-0.5 text-xs ${isOwnMessage
                                        ? 'bg-blue-400 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                    title={`Reacted by ${reaction.userIds.length} user${reaction.userIds.length > 1 ? 's' : ''}`}
                                >
                                    <span className="mr-1">{reaction.emoji}</span>
                                    {reaction.count > 1 && (
                                        <span className="text-[0.7rem]">{reaction.count}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {isHovered && (
                        <MessageActions
                            messageId={message._id}
                            onDelete={onDelete}
                            onReact={onReact}
                            isOwnMessage={isOwnMessage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
});

function formatMessageDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        if (isToday(date)) return 'Today';
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'MMMM d, yyyy');
    } catch (error) {
        return '';
    }
}

Message.displayName = 'Message';
export default Message;