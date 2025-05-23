import React, { useRef, useState } from 'react'
import { useAppDispatch } from '../store/store'
import Button from './Button'
import { useEffect } from 'react'
import { IoMdClose } from 'react-icons/io'
import classes from '../styles/userSidebar.module.css'
import useUserSearch from '../hooks/useUserSearch'
import useUserMessage from '../hooks/useUserMessage'
import AuthUserProfile from './AuthUserProfile'
import useClickOutSide from '../hooks/useClickOutSide'
import ErrorBoundary from './ErrorBoundary'
import GroupsList from './GroupList'
import UsersList from './UsersList'
import { useHamBurgerMenu } from '../context/HamburgerContext'
import { FiUsers, FiMessageSquare, FiLogOut, FiUser, FiSearch } from 'react-icons/fi'
import { createPortal } from 'react-dom'
import { MdGroupAdd } from 'react-icons/md'
import { openGroupCreationForm } from '../features/uiSlice/slice'
import { useUserActions } from '../context/UserActionsContext'
import useFetchPreviews from '../hooks/useFetchPreviews'

interface SidebarProp {
    ref?: React.RefObject<HTMLDivElement | null>
}
type ActiveTab = 'users' | 'groups'

const UserSidebar = React.forwardRef<HTMLDivElement, SidebarProp>((_, ref) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('users')
    const { selectedUserId } = useFetchPreviews();
    const { sidebarVisible } = useHamBurgerMenu()
    const dispatch = useAppDispatch();
    const { handleSearchUsers } = useUserSearch()
    const {
        handleLogout, handleDisplayAuthProfile, displayAuthProfile, setDisplayAuthProfile, handleToggleSidebar
    } = useUserActions();
    const { handleFetchMessages } = useUserMessage();
    const authPrfoileButtonRef = useRef<HTMLButtonElement>(null)
    const authProfileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        handleFetchMessages()
    }, [selectedUserId])

    useClickOutSide([authPrfoileButtonRef, authProfileRef], () => {
        if (displayAuthProfile === classes.showUserInfo) {
            setDisplayAuthProfile(classes.hideUserInfo)
        }
    }, [displayAuthProfile])

    return (
        <ErrorBoundary>
            <div
                ref={ref}
                className={`p-4 h-screen top-0 fixed shadow-lg flex flex-col gap-4 md:relative w-72 bg-white z-30 transition-all duration-300 ease-in-out ${sidebarVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                {/* Close button for mobile */}
                <button
                    className='md:hidden absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors'
                    onClick={handleToggleSidebar}
                >
                    <IoMdClose size={24} />
                </button>

                {/* Tab selection */}
                <div className='flex justify-between items-center gap-2 pt-2'>
                    <Button
                        className={`w-full flex items-center justify-center gap-2 py-2 ${activeTab === 'users' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}
                        onClick={() => setActiveTab('users')}
                        variant='ghost'
                    >
                        <FiUsers size={18} />
                        <span>Users</span>
                    </Button>
                    <Button
                        className={`w-full flex items-center justify-center gap-2 py-2 ${activeTab === 'groups' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}
                        onClick={() => setActiveTab("groups")}
                        variant='ghost'
                    >
                        <FiMessageSquare size={18} />
                        <span>Groups</span>
                    </Button>
                </div>

                {/* Search input */}
                <div className='relative'>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <FiSearch className='text-gray-400' />
                        </div>
                        <input
                            onChange={(e) => handleSearchUsers(e, activeTab)}
                            className='w-full rounded-lg pl-10 pr-4 py-2 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-gray-50 hover:bg-white'
                            type="search"
                            placeholder='Search...'
                        />
                    </div>
                    <div>
                        {
                            activeTab == 'groups' && <Button
                                variant="primary"
                                className="w-full my-2 flex items-center justify-center gap-2"
                                onClick={() => dispatch(openGroupCreationForm())}
                            >
                                <MdGroupAdd size={20} />
                                Create Group
                            </Button>
                        }
                    </div>
                </div>

                {/* Content area */}
                <ErrorBoundary>
                    <div className='flex-1 overflow-hidden flex flex-col'>
                        <div className='py-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                            {activeTab === "users" ? <UsersList /> : <GroupsList />}
                        </div>
                    </div>
                </ErrorBoundary>

                {/* Footer buttons */}
                <div className='flex gap-3 w-full mt-auto'>
                    <Button
                        className='w-full flex items-center justify-center gap-2 py-2'
                        onClick={handleLogout}
                        variant='outline'
                    >
                        <FiLogOut size={18} />
                        <span>Logout</span>
                    </Button>
                    <Button
                        className='w-full flex items-center justify-center gap-2 py-2'
                        ref={authPrfoileButtonRef}
                        onClick={handleDisplayAuthProfile}
                        variant='outline'
                    >
                        <FiUser size={18} />
                        <span>Profile</span>
                    </Button>
                </div>

                {/* Profile popup */}
                {
                    createPortal(<div
                        className={`fixed right-4 bottom-4 z-40 overflow-hidden rounded-lg shadow-xl bg-white ${classes.userInfo} ${displayAuthProfile}`}
                        ref={authProfileRef}
                    >
                        <AuthUserProfile />
                    </div>, document.body)
                }
            </div>
        </ErrorBoundary>
    )
})

UserSidebar.displayName = "UserSidebar"

export default UserSidebar