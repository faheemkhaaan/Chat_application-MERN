import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { useMemo, memo, useRef } from "react";
import useTypingIndicator from "../hooks/useTypingIndicator";
import useScrollToUnread from "../hooks/useScrollToUnread";
import useConversation from "../hooks/useConversation";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import useBlockUser from "../hooks/useBlockUser";
import { createSelector } from "@reduxjs/toolkit";
import useVideoCall from "../hooks/useVideoCall";
import { FaPhone, FaPhoneSlash } from "react-icons/fa";
import { isSameDay } from 'date-fns';
import api from "../api/api";
import { onGroupMessageReaction } from "../features/groupSlice/slice";
import { onAddReactionToUserMessage, onMessageDeleted } from "../features/conversationSlice/conversationSlice";
import ErrorBoundary from "./ErrorBoundary";
import Button from "./Button";

const chatMessageSelector = createSelector(
    [
        (state: RootState) => state.ui.selectedchatId.selectedGroupId,
        (state: RootState) => state.group.groups,
        (state: RootState) => state.auth.user?._id
    ],
    (selectedGroupId, groups, senderId) => {
        const selectedGroup = selectedGroupId ? groups[selectedGroupId] : undefined;
        return {
            isRequestPending: selectedGroup?.pendingRequests.some(user => user._id === senderId),
            isAGroupMember: selectedGroup?.members?.some(member => member._id === senderId),
            selectedGroupId,
            isCreator: selectedGroup?.creator._id === senderId,
            group: selectedGroup
        };
    }
);

function ChatMessages() {
    const { isTyping, typingUserId } = useTypingIndicator();
    const { senderId, selectedUserId, conversation } = useConversation();
    const users = useAppSelector(state => state.users.users);
    const isInitialLoad = useRef<boolean>(true);
    const { isAGroupMember, selectedGroupId, isRequestPending, isCreator, group } = useAppSelector(chatMessageSelector);
    const { isBlocked, blockedUser } = useBlockUser();
    const { ringing, callFromId, acceptCall } = useVideoCall();
    const dispatch = useAppDispatch()
    const { scrollbarRef } = useScrollToUnread({
        messages: conversation,
        currentUserId: senderId,
        isInitialLoad: isInitialLoad.current
    });
    const handleDeleteMessage = async (id: string) => {
        console.log(`Deleting message with id ${id}`)
        try {
            const res = await api.delete(`/message/deleteMessage?receiverId=${selectedUserId}&id=${id}`);
            console.log(res.data)
            if (res.status === 200) {
                if (selectedUserId) {
                    dispatch(onMessageDeleted({ message: res.data?.updatedMessage, userId: selectedUserId }));
                } else {

                }
            }
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddEmoji = async (id: string, emoji: string) => {
        console.log(`Message id ${id}, emoji ${emoji}`)
        try {
            const res = await api.patch(`/message/addReactions`, { receiverId: selectedUserId, messageId: id, emoji: emoji });
            console.log(res.data);
            if (res.status === 200) {
                if (selectedUserId) {
                    dispatch(onAddReactionToUserMessage({ message: res.data.updatedMessage, userId: selectedUserId }));
                } else if (selectedGroupId) {
                    dispatch(onGroupMessageReaction({ message: res.data.updatedMessage, groupId: selectedGroupId }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    const messages = useMemo(() => {
        if (!conversation || conversation.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p>No messages yet</p>
                    <p className="text-sm">Send a message to start the conversation</p>
                </div>
            );
        }

        const result = [];
        let lastDate: Date | null = null;

        for (let i = 0; i < conversation.length; i++) {
            const message = conversation[i];
            const currentDate = new Date(message.createdAt);

            if (!lastDate || !isSameDay(lastDate, currentDate)) {
                result.push(
                    <Message
                        key={`date-${message._id}`}
                        message={message}
                        senderId={senderId}
                        id={`message-${i}`}
                        showDate={true}
                        onDelete={handleDeleteMessage}
                        onReact={handleAddEmoji}
                    />
                );
            } else {
                result.push(
                    <Message
                        key={message._id}
                        message={message}
                        senderId={senderId}
                        id={`message-${i}`}
                        onDelete={handleDeleteMessage}
                        onReact={handleAddEmoji}
                    />
                );
            }

            lastDate = currentDate;
        }

        if (selectedUserId) {
            return result
        }
        if (selectedGroupId) {
            if (isAGroupMember) {
                return result
            } else {
                return null
            }
        }
        // return result;
    }, [conversation, senderId]);
    const handleJoinGroup = async () => {
        if (!group) return;
        try {
            const res = await api.post(`/group/requestToJoinGroup/${group._id}`);
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const handleLeaveGroup = async () => {
        if (!group) return;
        try {
            await api.post(`/group/leaveGroup/${group._id}`);
        } catch (error) {
            console.log(error);
        }
    }
    const renderButton = () => {
        if (isRequestPending) {
            return (
                <Button className="w-full py-1 text-sm">
                    Request already sent
                </Button>
            );
        }

        if (!isAGroupMember) {
            return (
                <Button onClick={handleJoinGroup} className="w-full py-1 text-sm">
                    Join Group
                </Button>
            );
        }

        if (!isCreator) {
            return (
                <Button
                    onClick={handleLeaveGroup}
                    variant="danger"
                    className="w-full py-1 text-sm"
                >
                    Leave Group
                </Button>
            );
        }

        return null;
    };


    return (
        <ErrorBoundary>

            <div
                ref={scrollbarRef}
                className="flex-1 overflow-y-auto bg-gray-50 relative "
            >
                <div className="p-4 mx-auto relative">
                    <div className="flex flex-col space-y-3">
                        {messages}
                    </div>

                    <TypingIndicator
                        isTyping={isTyping}
                        typingUserId={typingUserId}
                        selectedUserId={selectedUserId!}
                        users={users}
                    />


                    {isBlocked() && (
                        <div className="sticky bottom-5 left-1/2 -translate-x-1/2 transform w-[20vw] bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-md">
                            User blocked on {new Date(blockedUser()?.blockAt!).toLocaleDateString()}
                        </div>
                    )}

                    {!isAGroupMember && selectedGroupId && (
                        <div className=" absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                            <span>You're not a member of this group</span>
                            <span >
                                {renderButton()}
                            </span>
                        </div>
                    )}

                    {ringing && callFromId === senderId && (
                        <div className="fixed bottom-20 right-4 bg-white p-3 rounded-lg shadow-xl flex items-center gap-3 z-50">
                            <span className="font-medium">Incoming call</span>
                            <button
                                onClick={acceptCall}
                                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                            >
                                <FaPhone size={16} />
                            </button>
                            <button
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                                <FaPhoneSlash size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ErrorBoundary>
    );
}

export default memo(ChatMessages);