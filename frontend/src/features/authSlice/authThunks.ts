import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { User } from "../../types/slice.types";

export const updateProfile = createAsyncThunk<{ message: string, user: User }, FormData>("auth/updateImage", async (data, { rejectWithValue }) => {
    try {
        const response = await api.patch("/user/updateProfile", data, {
            headers: {
                'Content-Type': "multipart/form-data"
            }
        });

        return response.data;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || error.message)
    }
})
export const loginUser = createAsyncThunk("auth/loginUser", async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
        const response = await api.post("/auth/signin", credentials);
        return response.data; // Mongoose user object
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Login failed");
    }
});
export const createAccount = createAsyncThunk("auth/createAccount", async (credentials: { username: string, email: string, password: string }, { rejectWithValue }) => {
    try {
        const response = await api.post("/auth/signup", credentials);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Account creation failed")
    }
})
// ✅ Async Thunk for logging out
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
    try {
        await api.post("/auth/logout", {}, { withCredentials: true });
        return null; // Logout removes user
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Logout failed");
    }
});
