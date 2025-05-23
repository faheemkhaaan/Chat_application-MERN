import React from 'react';
import { User } from '../types/slice.types';
import { MdClose } from 'react-icons/md';
import { useAppSelector } from '../store/store';

interface UserProfileProps {
    user: User;
    onClose: () => void;
    onBlock?: (userId: string) => void;
    unBlock?: (userId: string) => void;
    isCurrentUser?: boolean;
    ref?: React.ForwardedRef<HTMLDivElement>;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose, onBlock, isCurrentUser, ref, unBlock }) => {
    if (!user) return;
    const onlineUsers = useAppSelector(state => state.users.onlineUsers);
    const authUser = useAppSelector(state => state.auth.user);
    const handleBlock = () => {
        if (onBlock && !isBlocked()) onBlock(user._id);
        if (unBlock && isBlocked()) unBlock(user._id);
    };
    const isBlocked = () => {
        return authUser?.blockedUsers.some(s => {
            // console.log(s.user)
            return s.user._id === user._id
        })
    }

    return (
        <div className="bg-white rounded-lg shadow-lg w-[350px] max-w-full overflow-hidden" ref={ref}>
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">User Profile</h2>

                <button onClick={onClose} className="text-gray-500 text-2xl cursor-pointer focus:outline-none">
                    <MdClose />
                </button>
            </div>
            <div className="p-5">
                <div className="relative w-[100px] h-[100px] mx-auto mb-5">
                    <img
                        src={user.picture || "/default-profile.png"}
                        alt={user.username}
                        className="w-full h-full rounded-full object-cover"
                    />
                    <div
                        className={`absolute bottom-[5px] right-[5px] w-[15px] h-[15px] rounded-full border-2 border-white 
                            ${onlineUsers[user._id]?.status === "online" ? "bg-green-500" :
                                onlineUsers[user._id]?.status === "offline" ? "bg-gray-400" :
                                    onlineUsers[user._id]?.status === "away" ? "bg-yellow-400" :
                                        onlineUsers[user._id]?.status === "busy" ? "bg-red-500" : ""
                            }`}
                    />
                </div>

                <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-1">{user.username}</h3>
                    <p className="text-gray-600 mb-4">{user.email}</p>

                    {user.bio && (
                        <p className="bg-gray-100 p-3 rounded text-sm mb-4">
                            {user.bio}
                        </p>
                    )}

                    <div className="flex justify-between text-sm mb-2 pb-2 border-b border-gray-200">
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className="text-gray-800 capitalize">{onlineUsers[user._id]?.status}</span>
                    </div>

                    {user.dob && (
                        <div className="flex justify-between text-sm mb-2 pb-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Age:</span>
                            <span className="text-gray-800">
                                {calculateAge(user.dob)} years
                            </span>
                        </div>
                    )}

                    {user.lastSeen && (
                        <div className="flex justify-between text-sm mb-2 pb-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">Last seen:</span>
                            <span className="text-gray-800">
                                {(new Date(user.lastSeen).toLocaleDateString())}
                            </span>
                        </div>
                    )}

                    <div className="mt-6 space-y-2">
                        {isCurrentUser ? (
                            <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 w-full">
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                onClick={handleBlock}
                                className={` ${isBlocked() ? "bg-blue-400" : "bg-red-400"} cursor-pointer text-white py-2 px-4 rounded ${isBlocked() ? "hover:bg-blue-700" : "hover:bg-red-700"} transition duration-300 w-full`}
                            >
                                {
                                    isBlocked() ? "Unblock User" : "Block User"
                                }

                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function to calculate age from DOB
function calculateAge(dob: Date | string): number {
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default UserProfile;
