import { WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ObjectId } from "mongodb";
import { getHomePage } from "./HomePageThunk";



interface HomePageState {
    homepage: WebsitePageModel | null;
    hasFetched: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: HomePageState = {
    homepage: null,
    hasFetched: false,
    isLoading: false,
    error: null,
};

const homePageSlice = createSlice({
    name: "homepage",
    initialState,
    reducers: {
        setHomePage(state, action: PayloadAction<WebsitePageModel>) {
            state.homepage = action.payload;
            state.hasFetched = true;
        },
        clearHomePage(state) {
            state.homepage = null;
            state.hasFetched = false;
        },
        setHasFetched(state, action: PayloadAction<boolean>) {
            state.hasFetched = action.payload;
        },
        setIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get HomePage
            .addCase(getHomePage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getHomePage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.homepage = action.payload;
                state.hasFetched = true;
                state.error = null;
            })
            .addCase(getHomePage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch homepage";
            });
    },
});

export const {
    setHomePage,
    clearHomePage,
    setHasFetched,
    setIsLoading,
} = homePageSlice.actions;

export default homePageSlice.reducer;
