

import ChatArea from "../components/ChatArea";
import UserSidebar from "../components/UserSidebar";
import { GlowEffectProvider } from "../context/GlowEffectContext";
import useClickOutSide from "../hooks/useClickOutSide";
import useChatLogic from "../hooks/useFetchPreviews";
import { useHamBurgerMenu } from "../context/HamburgerContext";
function Chat() {
    const { selectedUserId, selectedGroupId } = useChatLogic()
    const { sidebarRef, hamburgerRef, sidebarVisible, toggleSidebarVisibility } = useHamBurgerMenu()
    /* 
    the reason the hamburger is in the chat componenent and not in the chat header component is because i am using the ref for both the sidebar and the hamburger in the useClickOutside hook which closes the sidebar when the user clicks any where othe than the hamburger or the sidebar.
    */

    useClickOutSide([sidebarRef, hamburgerRef], () => {
        if (sidebarVisible) toggleSidebarVisibility()
    }, [sidebarVisible])

    return (
        <GlowEffectProvider>

            <section className={`grid  md:grid-cols-[300px_minmax(900px,_1fr)] h-screen overflow-hidden`} >
                {/* Sidebar for Users */}
                <UserSidebar ref={sidebarRef} />
                {/* Chat Area */}

                <ChatArea selectedUserId={selectedUserId!} selectedGroup={selectedGroupId!} />

            </section>
        </GlowEffectProvider>
    );
}

export default Chat; 