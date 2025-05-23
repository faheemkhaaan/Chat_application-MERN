import { searchGroups } from "../features/groupSlice/thunks";
import { fetchUsers, searchUsers } from "../features/user/thunks";
import { useAppDispatch } from "../store/store";
import useGroupChat from "./useGroupChat";

function useUserSearch() {
    const dispatch = useAppDispatch();
    const { handleFetchGroups } = useGroupChat()
    let searchingUserTimeOut: NodeJS.Timeout;
    const TIMEOUT_DELAY = 300;
    const handleSearchUsers = (e: React.ChangeEvent<HTMLInputElement>, type: "users" | "groups") => {
        const value = e.target.value;
        clearTimeout(searchingUserTimeOut)
        searchingUserTimeOut = setTimeout(() => {
            if (type === 'users') {
                if (value.trim() === "") {
                    dispatch(fetchUsers()); // fallback to full list
                } else {
                    dispatch(searchUsers({ value }));
                }
            } else if (type === 'groups') {
                if (value.trim() === "") {
                    handleFetchGroups(); // fallback to full group list
                } else {
                    dispatch(searchGroups({ name: value }));
                }
            }
        }, TIMEOUT_DELAY);
    }
    return { handleSearchUsers }
}
export default useUserSearch