import { createSelector } from "@reduxjs/toolkit";
import { createContext, ReactNode, useContext, useRef } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { toggleSidebar } from "../features/uiSlice/slice";



interface HamburgerContextProps {
    sidebarRef: React.RefObject<HTMLDivElement | null>;
    hamburgerRef: React.RefObject<HTMLButtonElement | null>;
    sidebarVisible: boolean;
    toggleSidebarVisibility: () => void;
}

const HamburgerContext = createContext<HamburgerContextProps | null>(null);
const usehamBurgerMenuSelector = createSelector(
    [
        (state: RootState) => state.ui.navigations.sidebarVisible,
    ],
    (sidebarVisible) => ({ sidebarVisible })
)
const HamburgerContextProvider = ({ children }: { children: ReactNode }) => {
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const hamburgerRef = useRef<HTMLButtonElement | null>(null);
    const { sidebarVisible } = useAppSelector(usehamBurgerMenuSelector);
    const dispatch = useAppDispatch()


    const toggleSidebarVisibility = () => {
        dispatch(toggleSidebar());
    };
    const value = {
        sidebarRef,
        hamburgerRef,
        sidebarVisible,
        toggleSidebarVisibility
    }
    return (
        <HamburgerContext.Provider value={value}>
            {children}
        </HamburgerContext.Provider>
    )
}
export const useHamBurgerMenu = () => {
    const context = useContext(HamburgerContext);
    if (!context) {
        throw new Error("Hamburger context can only be used inside the chat component");
    }
    return context
}
export default HamburgerContextProvider