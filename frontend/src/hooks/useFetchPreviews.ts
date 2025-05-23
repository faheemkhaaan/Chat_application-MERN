
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { useEffect } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { fetchPreviews } from "../features/conversationSlice/conversationSlice";

const chatLogicData = createSelector(
    [
        (state: RootState) => state.ui.selectedchatId.selectedUserId,
        (state: RootState) => state.ui.selectedchatId.selectedGroupId,
    ],
    (selectedUserId, selectedGroupId) => ({ selectedUserId, selectedGroupId })
)
function useFetchPreviews() {
    const { selectedUserId, selectedGroupId } = useAppSelector(chatLogicData);
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchPreviews());
    }, [dispatch])

    return { selectedUserId, selectedGroupId }
}
export default useFetchPreviews