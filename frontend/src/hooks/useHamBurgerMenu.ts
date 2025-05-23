import { useRef } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../store/store';
import { createSelector } from '@reduxjs/toolkit';
import { toggleSidebar } from '../features/uiSlice/slice';
const usehamBurgerMenuSelector = createSelector(
    [
        (state: RootState) => state.ui.navigations.sidebarVisible,
    ],
    (sidebarVisible) => ({ sidebarVisible })
)
function useHamBurgerMenu() {
    const sideBarRef = useRef<HTMLDivElement>(null)
    const hamBurgerMenuRef = useRef<HTMLButtonElement>(null);
    const { sidebarVisible } = useAppSelector(usehamBurgerMenuSelector);
    const dispatch = useAppDispatch()


    const toggleSidebarVisibility = () => {
        dispatch(toggleSidebar());
    };

    return { sideBarRef, hamBurgerMenuRef, toggleSidebarVisibility, sidebarVisible }
}

export default useHamBurgerMenu