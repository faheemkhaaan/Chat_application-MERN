import { IoMdClose } from "react-icons/io";
import Button from "./Button";
import { useAppDispatch, useAppSelector } from "../store/store";
import { colors } from "../utility/colors";
import { removeGroup } from "../features/groupSlice/slice";
import UserAvatar from "./UserAvatar";
import api from "../api/api";
import { Group } from "../types/slice.types";
import { useUserActions } from "../context/UserActionsContext";

interface GroupProfileProps {
    group: Group;
    onClose: () => void;
    onLeave?: () => void;
    onEdit?: () => void;
    onJoin?: () => void;
}

function GroupProfile({ group, onClose, onEdit }: GroupProfileProps) {
    if (!group) return <div>No Group Selected</div>
    const onlineUsers = useAppSelector(state => state.users.onlineUsers)
    const { user: currentUser } = useAppSelector(state => state.auth);
    const isAdmin = group.admins.some(admin => admin._id === currentUser?._id);
    const isCreator = group.creator._id === currentUser?._id;
    const isAMember = group.members.some(user => user._id === currentUser?._id);
    const isRequestPending = group.pendingRequests.some(user => user._id === currentUser?._id);
    const dispatch = useAppDispatch();
    const { handleSelectChat } = useUserActions()
    const handleDeleteGroup = async () => {
        try {
            await api.delete(`/group/deleteGroup/${group._id}`);
        } catch (error) {
            console.log(error)
        } finally {
            handleSelectChat(null, 'group')
            dispatch(removeGroup(group._id));
        }
    }
    const handleJoinGroup = async () => {
        try {
            const res = await api.post(`/group/requestToJoinGroup/${group._id}`);
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const handleLeaveGroup = async () => {
        try {
            await api.post(`/group/leaveGroup/${group._id}`);
        } catch (error) {
            console.log(error);
        }
    }
    const handleApproveRequest = async (userId: string, approve: boolean) => {
        try {
            const res = await api.patch(`/group/approveRequests/${group._id}/${userId}`, { approve });
            console.log(res)
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

        if (!isAMember) {
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
        <div className="absolute z-40 overflow-hidden rounded-sm shadow bg-white md:w-[25vw]  p-4 w-64">

            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 float-right">
                <IoMdClose size={20} />
            </button>


            <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border-2" style={{ borderColor: colors.Wenge }}>
                    <img
                        src={group.avatar || "/default-group.png"}
                        alt={group.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <h4 className="font-bold text-center" style={{ color: colors.Eerie_Black }}>
                    {group.name}
                </h4>
                {group.description && (
                    <p className="text-sm text-center text-gray-600 mt-1">
                        {group.description}
                    </p>
                )}
            </div>

            <div className="mb-4">
                {/* <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Created:</span>
                    <span>{new Date(group.createdAt || '').toLocaleDateString()}</span>
                </div> */}
                {/* <div className="flex justify-between text-sm">
                    <span className="font-medium">Members:</span>
                    <span>{group.members.length}</span>
                </div> */}
            </div>

            <div className="">
                <h5 className="font-medium mb-2" style={{ color: colors.Eerie_Black }}>
                    Admins
                </h5>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                    {group.admins.map(admin => (
                        <div key={admin._id} className="flex items-center gap-2">
                            <UserAvatar user={admin} size="sm" />
                            <span>{admin.username}</span>
                            {admin._id === group.creator._id && (
                                <span className="text-xs bg-gray-100 px-1 rounded" style={{ color: colors.Wenge }}>
                                    Creator
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div >
                <h5 className="font-medium" style={{ color: colors.Eerie_Black }}>
                    <span> Members</span>
                    <span className="mx-3 text-sm">({group.members.length})</span>
                </h5>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                    {group.members.map(member => {
                        const isOnline = onlineUsers[member._id]?.status === 'online';
                        return (
                            <div key={member._id} className="flex items-center gap-2">
                                <div className="relative">
                                    <UserAvatar user={member} size="sm" />
                                    {
                                        isOnline && <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-green-500 border-2 border-white"></span>
                                    }
                                </div>

                                <span>{member.username}</span>
                                {member._id === group.creator._id && (
                                    <span className="text-xs bg-gray-100 px-1 rounded" style={{ color: colors.Wenge }}>
                                        Creator
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
            {
                isAdmin && <div >
                    <h5 className="font-medium " style={{ color: colors.Eerie_Black }}>
                        Pending requests
                    </h5>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {group.pendingRequests.map(user => (
                            <div key={user._id} className="flex items-center gap-2">
                                <UserAvatar user={user} size="sm" />
                                <span className="flex-1">{user.username}</span>
                                <div className="flex justify-center items-center mr-2 ">
                                    <button onClick={() => handleApproveRequest(user._id, true)} className=" cursor-pointer p-2" aria-label="approve request to join group">✅</button>
                                    <button onClick={() => handleApproveRequest(user._id, false)} className=" cursor-pointer p-2" aria-label="reject request to join group">❌</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }

            <div className="flex flex-col gap-2 my-1">
                {isCreator && (
                    <Button
                        onClick={onEdit}
                        variant="primary"
                        className="w-full py-1 text-sm"
                    >
                        Edit Group
                    </Button>
                )}
                {isCreator && (
                    <Button
                        onClick={handleDeleteGroup}
                        variant="danger"
                        className="w-full py-1 text-sm"
                    >
                        Delete Group
                    </Button>
                )}
                {renderButton()}
            </div>
        </div>
    );
}

export default GroupProfile;