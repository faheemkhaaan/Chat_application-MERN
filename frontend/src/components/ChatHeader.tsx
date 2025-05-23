import { useRef, useState } from 'react';
import classes from '../styles/chatHeader.module.css';
import { RootState, useAppSelector } from '../store/store';
import useClickOutSide from '../hooks/useClickOutSide';
import SelectedChatItem from './SelectedChatItem';
import { createSelector } from '@reduxjs/toolkit';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useHamBurgerMenu } from '../context/HamburgerContext';

const selector = createSelector(
    [
        (state: RootState) => state.ui.selectedchatId.selectedUserId,
        (state: RootState) => state.ui.selectedchatId.selectedGroupId,
        (state: RootState) => state.users.users,
        (state: RootState) => state.group.groups
    ],
    (selectedUserId, selectedGroupId, users, groups) => {
        const selectedUser = selectedUserId ? users[selectedUserId] : null;
        const selectedGroup = selectedGroupId ? groups[selectedGroupId] : null
        return { selectedUser, selectedGroup }
    }
)

function ChatHeader() {
    const { selectedUser, selectedGroup } = useAppSelector(selector);
    const { hamburgerRef, sidebarVisible, toggleSidebarVisibility } = useHamBurgerMenu()
    const [selectedUserProfileDisplay, setSelectedUserProfileDisplay] = useState("");
    const selectedUserProfileRef = useRef<HTMLDivElement>(null);
    const userProfileBtnRef = useRef<HTMLButtonElement>(null);

    const selectedGroupProfileRef = useRef<HTMLDivElement>(null);
    const groupProfileBtnRef = useRef<HTMLButtonElement>(null);

    const handleSelectedUserProfile = () => {
        setSelectedUserProfileDisplay(prev => prev === classes.showSelectedUserProfile ? classes.hideSelectedUserProfile : classes.showSelectedUserProfile)
    }

    useClickOutSide([selectedUserProfileRef, userProfileBtnRef], () => {
        if (selectedUserProfileDisplay === classes.showSelectedUserProfile) {
            setSelectedUserProfileDisplay(classes.hideSelectedUserProfile)
        }
    }, [selectedUserProfileDisplay]);

    useClickOutSide([selectedGroupProfileRef, groupProfileBtnRef], () => {
        if (selectedUserProfileDisplay === classes.showSelectedUserProfile) {
            setSelectedUserProfileDisplay(classes.hideSelectedUserProfile)
        }
    }, [selectedUserProfileDisplay]);

    return (
        <header className='border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-white shadow-sm relative'>
            <div className="flex items-center gap-4">
                <button
                    aria-label="toggle sidebar"
                    aria-expanded={sidebarVisible}
                    ref={hamburgerRef}
                    className='p-1 md:hidden rounded-md hover:bg-gray-100 transition-colors'
                    onClick={toggleSidebarVisibility}
                >
                    <GiHamburgerMenu size={24} className="text-gray-600" />
                </button>

                {selectedUser ? (
                    <SelectedChatItem
                        type='user'
                        visible={selectedUserProfileDisplay}
                        selectedChat={selectedUser}
                        buttonRef={userProfileBtnRef}
                        profileRef={selectedUserProfileRef}
                        onClose={handleSelectedUserProfile}
                    />
                ) : selectedGroup ? (
                    <SelectedChatItem
                        type='group'
                        visible={selectedUserProfileDisplay}
                        selectedChat={selectedGroup}
                        buttonRef={groupProfileBtnRef}
                        profileRef={selectedGroupProfileRef}
                        onClose={handleSelectedUserProfile}
                    />
                ) : (
                    <p className="text-gray-500">No chat selected</p>
                )}
            </div>
        </header>
    );
}

export default ChatHeader;