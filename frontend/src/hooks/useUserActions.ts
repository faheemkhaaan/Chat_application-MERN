import { useState } from "react";
import { clearUsersOnLogout } from "../features/user/userSlice";
import { useAppDispatch } from "../store/store";
import sidebarClasses from '../styles/userSidebar.module.css';
import { logoutUser } from "../features/authSlice/authThunks";
import { setChatId, toggleSidebar } from "../features/uiSlice/slice";

function useUserActions() {
    const [displayAuthProfile, setDisplayAuthProfile] = useState<string>("");

    const dispatch = useAppDispatch();
    const handleSelectUserById = (id: string) => {

        dispatch(setChatId({ type: 'group', id }))
        dispatch(toggleSidebar())
    }
    const handleDisplayAuthProfile = (e: React.MouseEvent) => {
        e.stopPropagation()
        setDisplayAuthProfile(prev => prev == sidebarClasses.showUserInfo ? sidebarClasses.hideUserInfo : sidebarClasses.showUserInfo);

    }
    const handleLogout = () => {
        dispatch(clearUsersOnLogout());
        dispatch(logoutUser());
    }
    const handleToggleSidebar = () => {
        dispatch(toggleSidebar())
    }

    return { handleSelectUserById, handleLogout, handleDisplayAuthProfile, displayAuthProfile, setDisplayAuthProfile, handleToggleSidebar }
}
export default useUserActions