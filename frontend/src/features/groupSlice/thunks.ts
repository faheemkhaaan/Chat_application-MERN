import { createAsyncThunk } from "@reduxjs/toolkit";
import { Group } from "../../types/slice.types";
import api from "../../api/api";

export const createGroup = createAsyncThunk<
    Group,
    { groupInfo: FormData },
    { rejectValue: string }
>('groupChat/createGroup', async ({ groupInfo }, { rejectWithValue }) => {
    try {
        const response = await api.post("/group/createGroup", groupInfo, { headers: { 'Content-Type': "multipart/form-data" } });
        console.log(response.data)
        return response.data.group;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})
export const searchGroups = createAsyncThunk<Group[], { name: string }>("/groupChat/searchGroups", async ({ name }, { rejectWithValue }) => {
    try {
        const res = await api.get(`/group/searchGroups?name=${name}`);
        return res.data.groups
    } catch (error) {
        return rejectWithValue(error);
    }
})