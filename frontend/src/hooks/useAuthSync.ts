import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchUsers } from '../features/user/thunks';

function useAuthSync() {
    const dispatch = useAppDispatch();
    const { authenticated, user } = useAppSelector(state => state.auth);
    useEffect(() => {
        if (authenticated && user?._id) {
            dispatch(fetchUsers());
        }
    }, [authenticated, user?._id])
}

export default useAuthSync