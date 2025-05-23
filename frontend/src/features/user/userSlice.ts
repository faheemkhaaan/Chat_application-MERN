import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResponseFetchUsers, User } from "../../types/slice.types";
import { fetchUsers, searchUsers } from "./thunks";
type UsersDictionary = {
    [id: string]: User
}
type InitialState = {
    users: UsersDictionary;
    onlineUsers: { [_id: string]: { _id: string, status: "online" | "offline" | "away" | "busy" } }
    loading: boolean,
    error: null | string
}

const initialState: InitialState = {
    users: {},
    onlineUsers: {},
    loading: false,
    error: null
}
    ;

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {


        clearUsersOnLogout: (state) => {
            state.users = {};
        },
        setOnlineUsers: (state, action) => {
            for (const element of action.payload) {
                state.onlineUsers[element._id] = element
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<ResponseFetchUsers>) => {
                if (action.payload?.users) {
                    state.users = action.payload.users.reduce((acc: UsersDictionary, user) => {
                        acc[user._id] = user;
                        return acc
                    }, {});
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.users = {};
                state.error = action.payload as string;
            })
            .addCase(searchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users.reduce((acc: UsersDictionary, user) => {
                    acc[user._id] = user;
                    return acc;
                }, {});
                state.error = null;
            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
    }
})
export const { clearUsersOnLogout, setOnlineUsers } = userSlice.actions
export default userSlice.reducer