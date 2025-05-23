import { createSelector } from "@reduxjs/toolkit";
import useSidebarUsers from "../hooks/useSidebarUsers";
import useVideoCall from "../hooks/useVideoCall";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { User } from "../types/slice.types";
import { colors } from "../utility/colors";
import { FaPhone, FaPhoneSlash } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { useUserActions } from "../context/UserActionsContext";
import { getAllMessages } from "../features/conversationSlice/thunks";

const userListSelector = createSelector(
    [
        (state: RootState) => state.users.onlineUsers,
        (state: RootState) => state.conversations.conversations.conversationMap
    ], (onlineUsers, conversationMap) => {
        return { onlineUsers, conversationMap }
    }
);

function UsersList() {
    const dispatch = useAppDispatch()
    const { onlineUsers } = useAppSelector(userListSelector);
    const { users, previews } = useSidebarUsers();
    const { handleSelectChat } = useUserActions();
    const { ringing, callFromId, acceptCall, declineCall } = useVideoCall()

    const handleUserClick = (user: User) => {
        handleSelectChat(user._id, "user");
        dispatch(getAllMessages({ receiverId: user._id }))

    }

    const formatLastSeen = (dateString: Date) => {
        try {
            const date = new Date(dateString);
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (error) {
            return "unknown time";
        }
    }

    const truncateText = (text: string, maxLength = 20) => {
        if (!text) return "";
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    }

    return (
        <div className="flex-1 scrollbar py-4 h-[75vh]">
            <ul className="space-y-2">
                {Object.keys(users).length > 0 ? Object.values(users).map((user) => {
                    const preview = Object.values(previews).find(
                        p => p.userId === user._id
                    );
                    const isOnline = onlineUsers[user._id]?.status === 'online';
                    const isRinging = ringing && callFromId === user._id;
                    const lastMessage = preview?.lastMessage?.content?.text || "";
                    return (
                        <li
                            onClick={() => handleUserClick(user)}
                            key={user._id}
                            className="rounded-md text-[#1F2937] font-medium cursor-pointer overflow-hidden relative transition duration-300 hover:shadow-md hover:bg-gray-100"
                            style={{
                                color: colors.Eerie_Black,
                            }}
                        >
                            <div className='px-3 py-2 w-full flex items-center gap-3'
                                style={{ backgroundColor: colors.Isabelline }}>
                                <div className='relative'>
                                    <div className='rounded-full overflow-hidden size-10'>
                                        <img
                                            className='w-full h-full object-cover'
                                            src={user.picture || "/default-profile.png"}
                                            alt={user.username}
                                        />
                                    </div>
                                    <span
                                        className={`absolute -bottom-1 -right-1 z-50 w-3 h-3 rounded-full border-2 border-white ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
                                    ></span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className='truncate font-semibold'>
                                            {user.username}
                                        </span>
                                        {isRinging && (
                                            <div className="flex gap-2 items-center ml-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        acceptCall();
                                                    }}
                                                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 cursor-pointer"
                                                >
                                                    <FaPhone size={12} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); declineCall() }}
                                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 cursor-pointer"
                                                >
                                                    <FaPhoneSlash size={12} />
                                                </button>
                                            </div>
                                        )}
                                        {(preview && preview.unreadCount > 0) && (
                                            <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {preview.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 truncate">
                                            {lastMessage ? truncateText(lastMessage) : null}
                                        </span>
                                        <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                                            {isOnline ? "Online" : formatLastSeen(user.lastSeen)}
                                        </span>
                                    </div>
                                </div>


                            </div>
                        </li>
                    )
                }) : (
                    <div className="text-center py-8 text-gray-500">
                        No users found
                    </div>
                )}
            </ul>
        </div>
    )
}

export default UsersList