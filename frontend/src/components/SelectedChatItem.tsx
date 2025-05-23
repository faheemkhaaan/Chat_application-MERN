
import useBlockUser from "../hooks/useBlockUser";
import UserProfile from "./SelectedUserProfile"
import classes from '../styles/chatHeader.module.css';
import { colors } from "../utility/colors";
import { Group, User } from "../types/slice.types";
import GroupProfile from "./GroupProfile";
interface SelectedChatItemProps {
    type: "user" | "group";
    buttonRef: React.ForwardedRef<HTMLButtonElement>;
    onClose: () => void;
    selectedChat: User | Group;
    visible: string;
    profileRef?: React.ForwardedRef<HTMLDivElement>,
}
function SelectedChatItem({ selectedChat, buttonRef, onClose, visible, type, profileRef }: SelectedChatItemProps) {
    const { handleBlockUsers, handleUnBlockUsers } = useBlockUser()


    return (
        <>
            <button
                ref={buttonRef}
                className="text-lg font-semibold cursor-pointer relative inline-flex justify-center items-center gap-2"
                style={{
                    color: colors.Eerie_Black,
                    borderColor: colors.Wenge
                }}
                onClick={onClose}
            >
                <div className='size-10 overflow-hidden rounded-full'>
                    {
                        type == 'user'
                            ? <img className='w-full h-full object-cover' src={(selectedChat as User)?.picture || "/default-profile.png"} alt="" />
                            : <img className='w-full h-full object-cover' src={(selectedChat as Group)?.avatar || "/default-profile.png"} alt="" />
                    }

                </div>
                <span>{type == 'user' ? (selectedChat as User).username : (selectedChat as Group).name}</span>
            </button>

            {
                type === 'user'
                    ? (
                        <div ref={profileRef} aria-description='selected user profile' className={`absolute top-10 left-16  transition-all bg-amber-300  z-50 duration-500 ${classes.selectedUserProfile} ${visible}`} >
                            <UserProfile user={selectedChat as User} onClose={onClose} onBlock={handleBlockUsers} unBlock={handleUnBlockUsers} />
                        </div>
                    )
                    : <div ref={profileRef} aria-description='selected user profile' className={`absolute top-10 left-16  transition-all bg-amber-300  z-50 duration-500 ${classes.selectedUserProfile} ${visible}`} >
                        <GroupProfile group={(selectedChat as Group)} onClose={onClose} />
                    </div>
            }


        </>
    )
}

export default SelectedChatItem