import { SetStateAction } from "react"
import { ProfileLeftSidebarTabs, ProfileTab } from "../types/types"
import React from "react"

function ProfileLeftSidebar({ tabs, setSelectedTab }: { tabs: ProfileLeftSidebarTabs, setSelectedTab: React.Dispatch<SetStateAction<ProfileTab>> }) {

    return (
        <div className='bg-[#BFB48F] p-6 shadow-lg'>
            <ul className='space-y-4'>
                {tabs.map((item) => (
                    <li
                        onClick={() => setSelectedTab(item)}
                        key={item}
                        className='text-[#564E58] hover:text-[#904e55] cursor-pointer transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-[#f2efe980]'
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default ProfileLeftSidebar