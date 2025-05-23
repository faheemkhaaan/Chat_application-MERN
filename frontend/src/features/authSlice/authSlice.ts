import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthInitialState, LoginResponse, User } from "../../types/slice.types";
import { createAccount, loginUser, logoutUser, updateProfile } from "./authThunks";



const initialState: AuthInitialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
    authenticated: localStorage.getItem("auth") === 'true',
    loading: false,
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authenticateUser: (state, action) => {
            state.authenticated = action.payload
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.authenticated = !!action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload))
        },
        logout: (state) => {
            localStorage.removeItem("user");
            state.user = null
            state.authenticated = false;
            localStorage.removeItem("auth")
        },
        clearErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.user = action.payload.user;
                state.authenticated = true;
                localStorage.setItem("auth", 'true')
                state.loading = false;
                state.error = null;
                localStorage.setItem("user", JSON.stringify(action.payload.user))
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.authenticated = false;
                state.user = null;
                state.error = action.payload as AuthInitialState["error"];
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.authenticated = false;
                localStorage.removeItem("auth")
                state.error = null;
            })
            .addCase(createAccount.pending, (state) => {
                state.loading = true
            })
            .addCase(createAccount.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createAccount.rejected, (state, action) => {
                state.error = action.payload as AuthInitialState["error"];
                state.loading = false
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload.user;
                localStorage.setItem('user', JSON.stringify(action.payload.user))
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.error = action.payload as AuthInitialState["error"];
            });
    },
});

export const { setUser, authenticateUser, clearErrors } = authSlice.actions;
export default authSlice.reducer;
