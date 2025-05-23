
import { createSelector } from '@reduxjs/toolkit';
import { RootState, useAppSelector } from '../store/store';
import emitter from '../services/socket/socketEmitter.service'
const blockUserSelector = createSelector(
    [
        (state: RootState) => state.auth.user?.blockedUsers,
        (state: RootState) => state.ui.selectedchatId.selectedUserId,
    ],
    (blockedUsers, selectedUserId) => {
        return { blockedUsers, selectedUserId }
    }
)
function useBlockUser() {
    const { blockedUsers, selectedUserId } = useAppSelector(blockUserSelector)
    const handleBlockUsers = async (id: string) => {
        try {
            // const res = await api.patch("/user/blockUser", { blockedUserId: id });

            emitter.blockUser(id);
        } catch (error) {
            console.log(error)
        }
    }

    const handleUnBlockUsers = async (id: string) => {
        try {

            emitter.unblockUser(id);
        } catch (error) {
            console.log(error)
        }
    }
    const isBlocked = () => {
        if (!selectedUserId) return;
        return blockedUsers?.some(user => user.user._id === selectedUserId)
    }
    const blockedUser = () => {
        if (!selectedUserId) return;
        return blockedUsers?.find(user => user.user._id === selectedUserId);
    }
    return { handleBlockUsers, handleUnBlockUsers, isBlocked, blockedUser }
}

export default useBlockUser