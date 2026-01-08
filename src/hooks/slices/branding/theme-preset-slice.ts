import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ThemeType } from "@/components/branding/theme-preset/ThemeType";

// State interface
interface ThemePresetState {
    allThemes: ThemeType[];
    currentTheme: ThemeType | null;
    hasFetched: boolean;
    isLoading: boolean;
    error: string | null;
}

// Initial state
const initialState: ThemePresetState = {
    allThemes: [],
    currentTheme: null,
    hasFetched: false,
    isLoading: false,
    error: null,
};

// CRUD Thunks

// Create Theme
export const createThemeThunk = createAsyncThunk(
    "themePreset/create",
    async (themeData: Omit<ThemeType, "_id" | "createdAt" | "updatedAt">, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/admin/branding/themes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(themeData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create theme");
            }

            const data = await response.json();
            return data.item as ThemeType;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to create theme");
        }
    }
);

// Read All Themes
export const fetchAllThemesThunk = createAsyncThunk(
    "themePreset/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/admin/branding/themes");

            if (!response.ok) {
                throw new Error("Failed to fetch themes");
            }

            const data = await response.json();
            return data.items as ThemeType[];
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch themes");
        }
    }
);

// Read Single Theme by ID
export const fetchThemeByIdThunk = createAsyncThunk(
    "themePreset/fetchById",
    async (themeId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/admin/branding/themes?id=${themeId}`);

            if (!response.ok) {
                throw new Error("Failed to fetch theme");
            }

            const data = await response.json();
            return data.item as ThemeType;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch theme");
        }
    }
);

// Update Theme
export const updateThemeThunk = createAsyncThunk(
    "themePreset/update",
    async ({ id, themeData }: { id: string; themeData: Partial<ThemeType> }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/admin/branding/themes?id=${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(themeData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update theme");
            }

            const data = await response.json();
            return data.item as ThemeType;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update theme");
        }
    }
);

// Delete Theme
export const deleteThemeThunk = createAsyncThunk(
    "themePreset/delete",
    async (themeId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/admin/branding/themes?id=${themeId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete theme");
            }

            const data = await response.json();
            return { deletedId: themeId, ...data };
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to delete theme");
        }
    }
);

// Slice
const themePresetSlice = createSlice({
    name: "themePreset",
    initialState,
    reducers: {
        setAllThemes(state, action: PayloadAction<ThemeType[]>) {
            state.allThemes = action.payload;
            state.hasFetched = true;

            // If currentTheme is not set, pick the first active theme or first theme
            if (!state.currentTheme && action.payload.length > 0) {
                const activeTheme = action.payload.find((theme) => theme.active);
                state.currentTheme = activeTheme || action.payload[0];
            }
        },
        setCurrentTheme(state, action: PayloadAction<ThemeType | null>) {
            state.currentTheme = action.payload;
        },
        clearThemes(state) {
            state.allThemes = [];
            state.currentTheme = null;
            state.hasFetched = false;
        },
        resetError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Theme
            .addCase(createThemeThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createThemeThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allThemes.push(action.payload);
                // Set as current theme if it's the first one or if it's active
                if (state.allThemes.length === 1 || action.payload.active) {
                    state.currentTheme = action.payload;
                }
            })
            .addCase(createThemeThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Fetch All Themes
            .addCase(fetchAllThemesThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllThemesThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allThemes = action.payload;
                state.hasFetched = true;

                // Set current theme to active theme or first theme
                if (!state.currentTheme && action.payload.length > 0) {
                    const activeTheme = action.payload.find((theme) => theme.active);
                    state.currentTheme = activeTheme || action.payload[0];
                }
            })
            .addCase(fetchAllThemesThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.hasFetched = true; // Mark as fetched even on error to prevent infinite retries
            })

            // Fetch Theme by ID
            .addCase(fetchThemeByIdThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchThemeByIdThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentTheme = action.payload;

                // Update in allThemes array if it exists
                const index = state.allThemes.findIndex((theme) => theme._id === action.payload._id);
                if (index !== -1) {
                    state.allThemes[index] = action.payload;
                } else {
                    state.allThemes.push(action.payload);
                }
            })
            .addCase(fetchThemeByIdThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Update Theme
            .addCase(updateThemeThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateThemeThunk.fulfilled, (state, action) => {
                state.isLoading = false;

                // Update in allThemes array
                const index = state.allThemes.findIndex((theme) => theme._id === action.payload._id);
                if (index !== -1) {
                    state.allThemes[index] = action.payload;
                }

                // Update currentTheme if it's the same theme
                if (state.currentTheme?._id === action.payload._id) {
                    state.currentTheme = action.payload;
                }

                // If the updated theme is now active, set it as current
                if (action.payload.active) {
                    state.currentTheme = action.payload;
                }
            })
            .addCase(updateThemeThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Delete Theme
            .addCase(deleteThemeThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteThemeThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const deletedId = action.payload.deletedId;

                // Remove from allThemes array
                state.allThemes = state.allThemes.filter((theme) => theme._id !== deletedId);

                // Clear currentTheme if it was the deleted one
                if (state.currentTheme?._id === deletedId) {
                    // Set to first active theme or first theme
                    const activeTheme = state.allThemes.find((theme) => theme.active);
                    state.currentTheme = activeTheme || (state.allThemes.length > 0 ? state.allThemes[0] : null);
                }
            })
            .addCase(deleteThemeThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

// Export actions
export const { setAllThemes, setCurrentTheme, clearThemes, resetError } = themePresetSlice.actions;

// Export reducer
export default themePresetSlice.reducer;
