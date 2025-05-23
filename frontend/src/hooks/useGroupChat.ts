import { useEffect } from "react";
import { getSocket } from "../services/socket/socket.service";
import { setGroups } from "../features/groupSlice/slice";
import { useAppDispatch } from "../store/store";
import { setupGroupListeners } from "../services/socket/socketGroups.service";

function useGroupChat() {
    const dispatch = useAppDispatch();

    const handleFetchGroups = () => {
        const socket = getSocket();
        if (!socket) return;
        socket.emit("group:fetch", (res) => {
            dispatch(setGroups(res));
        })
    }
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;
        const { fetchGroups } = setupGroupListeners(socket, dispatch);
        fetchGroups()
    }, [])

    return { handleFetchGroups }
}

export default useGroupChat