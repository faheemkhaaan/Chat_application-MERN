
import useBlockUser from '../../hooks/useBlockUser';
import { useAppSelector } from '../../store/store';


const BlockedUsersList = () => {
    const blockedUsers = useAppSelector(state => state.auth.user?.blockedUsers);
    const { handleUnBlockUsers } = useBlockUser()
    return (
        <div className="p-4 space-y-4 bg-[#f2efe9]">
            <h2 className="text-xl font-semibold">Blocked Users</h2>
            {blockedUsers && blockedUsers.length === 0 ? (
                <p className="text-gray-500">You haven’t blocked anyone yet.</p>
            ) : (
                <ul className="space-y-3">
                    {blockedUsers && blockedUsers.map((user) => (
                        <li key={user.user._id} className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg shadow-sm">
                            <img
                                src={user.user.picture || "/default-profile.png"}
                                alt={user.user.username}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="text-gray-800 font-medium flex-1">{user.user.username}</span>
                            <button className='cursor-pointer hover:text-blue-700' onClick={() => handleUnBlockUsers(user.user._id)}>unblock</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BlockedUsersList;
