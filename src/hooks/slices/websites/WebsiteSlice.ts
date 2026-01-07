import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Website } from "@/components/admin/AppShell";
import { deleteWebsiteById, fetchWebsiteById } from "./WebsiteThunk";

interface WebsitesState {
  websites: Website[];
  currentWebsite: Website | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WebsitesState = {
  websites: [],
  currentWebsite: null,
  isLoading: false,
  error: null,
};


const websitesSlice = createSlice({
  name: "websites",
  initialState,
  reducers: {
    setWebsites(state, action: PayloadAction<Website[]>) {
      state.websites = action.payload;
      // If currentWebsite is not set, pick the first one
      if (!state.currentWebsite && action.payload.length > 0) {
        state.currentWebsite = action.payload[0];
      }
    },
    clearWebsites(state) {
      state.websites = [];
      state.currentWebsite = null;
    },
    setCurrentWebsite(state, action: PayloadAction<Website | null>) {
      state.currentWebsite = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWebsiteById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWebsiteById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWebsite = action.payload;
        // Also update in websites array if it exists
        const index = state.websites.findIndex((w) => w._id === action.payload._id);
        if (index !== -1) {
          state.websites[index] = action.payload;
        } else {
          state.websites.push(action.payload);
        }
      })
      .addCase(fetchWebsiteById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteWebsiteById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteWebsiteById.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload.deletedId;
        // Remove from websites array
        state.websites = state.websites.filter((w) => w._id !== deletedId);
        // Clear currentWebsite if it was the deleted one
        if (state.currentWebsite?._id === deletedId) {
          state.currentWebsite = state.websites.length > 0 ? state.websites[0] : null;
        }
      })
      .addCase(deleteWebsiteById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setWebsites, clearWebsites, setCurrentWebsite } = websitesSlice.actions;
export default websitesSlice.reducer;
