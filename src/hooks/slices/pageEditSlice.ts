import { PageModel } from '@/types/pages/PageModel';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Thunk to save page (async)

import { AppDispatch, RootState } from '@/store/store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { pageService } from '@/modules/website/page-service';
import { WebsitePageModel } from '@/components/admin/website/websitePage/WebsitePageType';
import { TenantModel } from '@/components/admin/accounts/AccountType';
import { fetchAccount } from './user/accountSlice';
import { MockPageData, ThemeModel } from '@/app/demo/page';
interface PageEditState {
  page: WebsitePageModel | null;
  mockPage: MockPageData | null;
  updatePage: WebsitePageModel | null;
  themePage: ThemeModel | null
  tenant: TenantModel | null,
  hasfetchPage: boolean,
  isLoading: boolean
  error: string
}

const initialState: PageEditState = {
  page: null,
  updatePage: null,
  mockPage: null,
  themePage: null,
  tenant: null,
  hasfetchPage: false,
  isLoading: false,
  error: ''
}
// Thunk to fetch website by ID
export const fetchWebsiteThunk = createAsyncThunk(
  'pageEdit/homeWebsite',
  async ({ tenantId, slug }: { tenantId: string, slug: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/public/pages?slug=${slug}&tenantId=${tenantId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch website' }));
        return rejectWithValue(errorData.error || 'Failed to fetch website');
      }

      const data = await response.json();
      return data.item;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Thunk to save page via API
export const savePageThunk = createAsyncThunk(
  'pageEdit/savePage',
  async (payload: { id: string; tenantId: string, content: string }, { getState, dispatch }) => {
    const data = {
      id: payload.id,
      tenantId: payload.tenantId,
      content: payload.content
    }
    try {
      const response = await fetch(`/api/pages/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {

        const updatedPage = await response.json();
        // console.log("updatedPage---->", updatedPage)
        // const { page } = (getState() as RootState).pageEdit;
        // const oldPage = { ...page, content: payload.content };
        // dispatch(setPageEdit(oldPage));
        //   console.log("savePageThunk - Dispatching setPageEdit with updated content");
        //  dispatch(setPageEdit(updatedPage));
        return {
          ok: true,
          message: "Page saved successfully"
        }
      }

      // if (!response.ok) throw new Error('Failed to save page');
      // // Optionally update local state
      // const { page } = (getState() as RootState).pageEdit;
      // console.log("savePageThunk - Current page from Redux:", {
      //   hasPage: !!page,
      //   currentContentLength: page?.content?.length || 0,
      //   newContentLength: payload.content?.length || 0
      // });

      // if (page) {
      //   const updatedPage = { ...page, content: payload.content };
      //   console.log("savePageThunk - Dispatching setPageEdit with updated content");
      //  dispatch(setPageEdit(updatedPage));
      // }
      // return {
      //   ok: true,
      //   message: "Page saved successfully"
      // }
    } catch (error) {
      // Optionally handle error (e.g., show toast)
      throw error;
    }
  }
);


export const pageEditSlice = createSlice({
  name: 'pageEdit',
  initialState,
  reducers: {
    setPageEdit: (state, action) => {

      state.page = action.payload;
      state.hasfetchPage = true
    },
    updatePage: (state, action) => {
      state.updatePage = action.payload

    },
    setMockPage: (state, action) => {
      const { page, theme } = action.payload
      state.mockPage = page
      state.themePage = theme
    },
    clearPageEdit: (state) => {
      state.page = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch website thunk
      .addCase(fetchWebsiteThunk.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(fetchWebsiteThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.page = action.payload;
        state.hasfetchPage = true
        state.error = '';
      })
      .addCase(fetchWebsiteThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch website';
      })
      // Save page thunk
      .addCase(savePageThunk.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(savePageThunk.fulfilled, (state, action) => {

        state.isLoading = false;
        state.error = '';
      })
      .addCase(savePageThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to save page';
      })

      // update tenant thunk
      .addCase(fetchAccount.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tenant = action.payload;
        state.error = '';
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update tenant';
      });
  },
});






export const { setPageEdit, clearPageEdit, updatePage, setMockPage } = pageEditSlice.actions;
export default pageEditSlice.reducer;
