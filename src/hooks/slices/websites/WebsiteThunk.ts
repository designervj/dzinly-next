import { Website } from "@/components/admin/AppShell";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Thunk to fetch website by _id
export const fetchWebsiteById = createAsyncThunk(
  "websites/fetchById",
  async (websiteId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/domain/website?id=${websiteId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch website");
      }

      const data = await response.json();
      return data.item as Website;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch website");
    }
  }
);

// Thunk to delete website by _id
export const deleteWebsiteById = createAsyncThunk(
  "websites/deleteById",
  async (websiteId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/domain/website?id=${websiteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete website");
      }
   console.log("response.  delete by id",response)
      const data = await response.json();
      return { deletedId: websiteId, ...data };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete website");
    }
  }
);
