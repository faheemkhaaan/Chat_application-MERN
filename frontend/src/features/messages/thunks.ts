import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { Conversation } from "../../types/slice.types";
import api from "../../api/api";
import axios from "axios";

export const getAllMessages = createAsyncThunk<
    { conversation: Conversation }, // Return type of the payload creator
    { receiverId: string },    // Argument type (receiverId)
    {
        state: RootState
        rejectValue: string;
    }
>("messages/getAllMessages", async ({ receiverId }, { rejectWithValue }) => {
    try {

        const response = await api.get<{ conversation: Conversation }>(`/message/getMessages/${receiverId}`);
        return { conversation: response.data.conversation }// Explicitly return the messages array
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
        return rejectWithValue('An unknown error occurred');
    }
});


export const getConversation = createAsyncThunk("users/getConversation", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/user/getConversation');
        return res.data
    } catch (error) {
        return rejectWithValue(error)
    }
});
