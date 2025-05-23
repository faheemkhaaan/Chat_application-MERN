import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { getSocket } from "../services/socket/socket.service";
import { createSelector } from "@reduxjs/toolkit";
import { setOnlineUsers } from "../features/user/userSlice";


const userPreviewsData = createSelector(
    [
        (state: RootState) => state.users.users,
        (state: RootState) => state.conversations.previews.conversatoinPreviews.entities,
        (state: RootState) => state.conversations.previews.conversatoinPreviews.ids
    ],
    (users, previews, previewsIds) => {
        return { users, previews, previewsIds }
    }
)
function useSidebarUsers() {
    const dispatch = useAppDispatch()
    const { users, previews, previewsIds } = useAppSelector(userPreviewsData);
    const socket = getSocket()

    useEffect(() => {
        if (!socket) return;
        socket.emit("requestOnlineUsers");

        socket.on("onlineUsers", (onlineUserIds) => {
            dispatch(setOnlineUsers(onlineUserIds))
        })
        return () => {
            socket.off("onlineUsers")
        }
    }, [socket])
    return { users, previews, previewsIds }
}

export default useSidebarUsers