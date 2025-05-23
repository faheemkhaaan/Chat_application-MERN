import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface UIInitialState {
    navigations: {
        sidebarVisible: boolean,
    },
    modals: {
        groupCreationFormOpen: boolean,
        userProfile: boolean
    },
    selectedchatId: {
        selectedUserId: null | string,
        selectedGroupId: null | string
    }
}

const initialState: UIInitialState = {
    navigations: {
        sidebarVisible: false,
    },
    modals: {
        groupCreationFormOpen: false,
        userProfile: false
    },
    selectedchatId: {
        selectedUserId: null,
        selectedGroupId: null
    }
}

const uiSlice = createSlice({
    name: "uiSlice",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.navigations.sidebarVisible = !state.navigations.sidebarVisible;
        },

        openGroupCreationForm: (state) => {
            state.modals.groupCreationFormOpen = true;
        },
        closeGroupCreationForm: (state) => {
            state.modals.groupCreationFormOpen = false;
        },
        setChatId: (state, action: PayloadAction<{ type?: "user" | "group", id: string | null }>) => {
            const { type, id } = action.payload;
            if (type == 'user') {
                state.selectedchatId.selectedUserId = id;
                state.selectedchatId.selectedGroupId = null;
            } else if (type == 'group') {
                state.selectedchatId.selectedGroupId = id
                state.selectedchatId.selectedUserId = null;
            }
        }


    }
});


export const { toggleSidebar, openGroupCreationForm, closeGroupCreationForm, setChatId } = uiSlice.actions
export default uiSlice.reducer;