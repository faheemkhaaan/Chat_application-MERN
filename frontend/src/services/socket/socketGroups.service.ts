import { setGroups } from "../../features/groupSlice/slice";
import { AppDispatch } from "../../store/store";
import { ISocket } from "../../types/socket.types";


export const setupGroupListeners = (socket: ISocket, dispatch: AppDispatch) => {
    const fetchGroups = () => {
        socket.emit("group:fetch", (res) => {
            // console.log("updated group after deleting", res);
            dispatch(setGroups(res));
        })
    };
    socket.on("groupUpdated", fetchGroups);
    socket.on("groupDeleted", fetchGroups);
    socket.on("groupCreated", fetchGroups);
    socket.on("leftGroup", fetchGroups);
    socket.on('requestApproved', fetchGroups);
    // socket.on("makeAdmin",fetchGroups);
    // scoekt.on("requestConfirmed",fetchGroups);
    return {
        fetchGroups,
        cleanups: () => {
            socket.off("groupDeleted");
            socket.off("groupUpdated")
            socket.off("groupCreated");
            socket.off("leftGroup");
            socket.off("requestApproved");

        }
    }
}

