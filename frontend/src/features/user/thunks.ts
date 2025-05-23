import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { logoutUser } from "../authSlice/authThunks";
import { ResponseFetchUsers, User } from "../../types/slice.types";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { getState, rejectWithValue, dispatch }) => {
    try {
        const { auth } = getState() as { auth: { authenticated: boolean } };
        if (!auth.authenticated) {
            return { users: [] }
        }
        const res = await api.get<ResponseFetchUsers>("/user/users");
        return res.data
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(logoutUser());
        }
        return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
});
export const searchUsers = createAsyncThunk<
    { success: boolean, users: User[] },
    { value: string }
>("users/searchUsers", async ({ value }, { rejectWithValue }) => {
    try {
        const res = await api.get<{ success: boolean, users: User[] }>(`/user/searchUsers?username=${value}`);
        console.log(res.data)
        return res.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "Failed to search users";
        return rejectWithValue(message); // ✅ Only return a string
    }
})