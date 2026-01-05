import { WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ObjectId } from "mongodb";

// Thunk to fetch homepage by tenantId and slug
export const getHomePage = createAsyncThunk<
    WebsitePageModel,
    { tenantId: string | ObjectId; slug: string },
    { rejectValue: string }
>(
    "homepage/getHomePage",
    async ({ tenantId, slug }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/public/pages/${slug}`, {
                headers: {
                    "x-tenant-id": String(tenantId),
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to fetch homepage");
            }

            const data = await response.json();
            return data.item;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to fetch homepage");
        }
    }
);