
import { useState } from 'react';
import { ProfileLeftSidebarTabs, ProfileTab } from '../types/types';
import ProfileOverview from './ProfileOverview';
import ProfileLeftSidebar from './ProfileLeftSidebar';
import BlockedUsersList from './profilestabs/BlockedUsersList';
import MediaTab from './profilestabs/MediaTab';
import LinkTab from './profilestabs/LinkTab';
import GroupsTab from './profilestabs/GroupsTab';



function AuthUserProfile() {
    const tabs: ProfileLeftSidebarTabs = ['Overview', 'Media', 'Link', 'Groups', "Blocked list"]
    const [selectedTab, setSelectedTab] = useState<ProfileTab>("Overview");

    const content = () => {
        switch (selectedTab) {
            case 'Overview':
                return <ProfileOverview />
            case "Media":
                return <MediaTab />
            // case "Files":
            //     return <FilesTab />
            case "Link":
                return <LinkTab />
            // case "Events":
            //     return <EventsTab />
            case "Groups":
                return <GroupsTab />
            // case "Games":
            //     return <GamesTab />
            case "Blocked list":
                return <BlockedUsersList />

            default:
                return <div>No tab selected</div>
        }
    }
    return (
        <div className={`grid grid-cols-[30%_1fr] h-full transition-all duration-300`}>
            {/* Left Sidebar */}

            <ProfileLeftSidebar tabs={tabs} setSelectedTab={setSelectedTab} />
            {/* Main Content */}

            {
                content()
            }
        </div >
    );
}




export default AuthUserProfile;