import { TenantModel } from "@/components/admin/accounts/AccountType";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to get all accounts (tenants)
export const getAllAccounts = createAsyncThunk<TenantModel[]>(
  "account/getAllAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/admin/users/accounts");
      // API returns { tenants: TenantModel[], count: number }
      return response.data.tenants;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

interface AccountState {
  allAccounts: TenantModel[];
  isLoading: boolean;
  hasFetched: boolean;
}

const initialState: AccountState = {
  allAccounts: [],
  isLoading: false,
  hasFetched: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccounts(state, action: PayloadAction<TenantModel[]>) {
      state.allAccounts = action.payload;
      state.hasFetched = true;
    },
    clearAccounts(state) {
      state.allAccounts = [];
      state.hasFetched = false;
    },
    addAccount(state, action: PayloadAction<TenantModel>) {
      state.allAccounts.unshift(action.payload);
    },
    updateAccount(state, action: PayloadAction<TenantModel>) {
      const index = state.allAccounts.findIndex(
        (account) => account._id === action.payload._id
      );
      if (index !== -1) {
        state.allAccounts[index] = action.payload;
      }
    },
    removeAccount(state, action: PayloadAction<string>) {
      state.allAccounts = state.allAccounts.filter(
        (account) => account._id.toString() !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAccounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getAllAccounts.fulfilled,
        (state, action: PayloadAction<TenantModel[]>) => {
          state.isLoading = false;
          state.hasFetched = true;
          state.allAccounts = action.payload;
        }
      )
      .addCase(getAllAccounts.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setAccounts,
  clearAccounts,
  addAccount,
  updateAccount,
  removeAccount,
} = accountSlice.actions;

export default accountSlice.reducer;
