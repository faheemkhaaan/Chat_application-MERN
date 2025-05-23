import { createContext, ReactNode, useContext, useState } from "react";
import { useAppDispatch } from "../store/store";
import { clearUsersOnLogout } from "../features/user/userSlice";
import { logoutUser } from "../features/authSlice/authThunks";
import { setChatId, toggleSidebar } from "../features/uiSlice/slice";
import sidebarClasses from '../styles/userSidebar.module.css';


interface IUserActionsValues {
    handleLogout: () => void;
    handleToggleSidebar: () => void;
    handleDisplayAuthProfile: (e: React.MouseEvent) => void;
    handleSelectChat: (id: string | null, type: 'user' | "group") => void;
    displayAuthProfile: string;
    setDisplayAuthProfile: React.Dispatch<React.SetStateAction<string>>
}

const UserActionsContext = createContext<IUserActionsValues | null>(null)

export const useUserActions = () => {
    const context = useContext(UserActionsContext)
    if (!context) {
        throw new Error("userUserActions can only be used inside the UserActionsProvider")
    }
    return context
}

const UserActionsProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch()
    // logout action
    const handleLogout = () => {
        dispatch(clearUsersOnLogout());
        dispatch(logoutUser());
    }

    const [displayAuthProfile, setDisplayAuthProfile] = useState<string>("");


    const handleToggleSidebar = () => {
        dispatch(toggleSidebar())
    }
    // click on profile btn to view the profile action

    const handleDisplayAuthProfile = (e: React.MouseEvent) => {
        e.stopPropagation()
        setDisplayAuthProfile(prev => prev == sidebarClasses.showUserInfo ? sidebarClasses.hideUserInfo : sidebarClasses.showUserInfo);

    }

    // selecting user or group actions
    const handleSelectChat = (id: string | null, type: "user" | "group") => {
        dispatch(setChatId({ type, id }))


        dispatch(toggleSidebar())
    }
    // navigating between user list to groups list actions 
    // user searches & group searches actions
    // deleting comments && adding reactions actions
    // typing message , sending message ,adding emojis to the messages actions
    // video call button actions 
    const value = {
        handleLogout,
        handleToggleSidebar,
        handleSelectChat,
        handleDisplayAuthProfile,
        setDisplayAuthProfile,
        displayAuthProfile
    }
    return <UserActionsContext.Provider value={value}>
        {children}
    </UserActionsContext.Provider>
}

export default UserActionsProvider