import { PackageModel } from "@/components/admin/users/package/packageType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllPackages,
  createPackage,
  updatePackage as updatePackageThunk,
  deletePackage,
  getPackageById,
} from "./packageThunks";

interface PackageState {
  allPackages: PackageModel[];
  hasFetched: boolean;
  currentPackage: PackageModel | null;
  isLoading: boolean;
}

const initialState: PackageState = {
  allPackages: [],
  hasFetched: false,
  currentPackage: null,
  isLoading: false,
};

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    setPackages(state, action: PayloadAction<PackageModel[]>) {
      state.allPackages = action.payload;
      state.hasFetched = true;
    },
    clearPackages(state) {
      state.allPackages = [];
      state.hasFetched = false;
    },
    setCurrentPackage(state, action: PayloadAction<PackageModel | null>) {
      state.currentPackage = action.payload;
    },
    addPackage(state, action: PayloadAction<PackageModel>) {
      state.allPackages.unshift(action.payload);
    },
    updatePackage(state, action: PayloadAction<PackageModel>) {
      const index = state.allPackages.findIndex(
        (pkg) => pkg._id === action.payload._id
      );
      if (index !== -1) {
        state.allPackages[index] = action.payload;
      }
      // Update currentPackage if it's the same one
      if (state.currentPackage?._id === action.payload._id) {
        state.currentPackage = action.payload;
      }
    },
    removePackage(state, action: PayloadAction<string>) {
      state.allPackages = state.allPackages.filter(
        (pkg) => pkg._id.toString() !== action.payload
      );
      // Clear currentPackage if it's the one being removed
      if (state.currentPackage?._id.toString() === action.payload) {
        state.currentPackage = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Packages
      .addCase(getAllPackages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getAllPackages.fulfilled,
        (state, action: PayloadAction<PackageModel[]>) => {
          state.isLoading = false;
          state.hasFetched = true;
          state.allPackages = action.payload;
        }
      )
      .addCase(getAllPackages.rejected, (state) => {
        state.isLoading = false;
      })
      // Create Package
      .addCase(createPackage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.data) {
          state.allPackages.unshift(action.payload.data);
        }
      })
      .addCase(createPackage.rejected, (state) => {
        state.isLoading = false;
      })
      // Update Package
      .addCase(updatePackageThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePackageThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.data) {
          const index = state.allPackages.findIndex(
            (pkg) => pkg._id === action.payload.data._id
          );
          if (index !== -1) {
            state.allPackages[index] = action.payload.data;
          }
          if (state.currentPackage?._id === action.payload.data._id) {
            state.currentPackage = action.payload.data;
          }
        }
      })
      .addCase(updatePackageThunk.rejected, (state) => {
        state.isLoading = false;
      })
      // Delete Package
      .addCase(deletePackage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allPackages = state.allPackages.filter(
          (pkg) => pkg._id.toString() !== action.payload._id.toString()
        );
        if (state.currentPackage?._id.toString() === action.payload._id.toString()) {
          state.currentPackage = null;
        }
      })
      .addCase(deletePackage.rejected, (state) => {
        state.isLoading = false;
      })
      // Get Package By ID
      .addCase(getPackageById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPackageById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPackage = action.payload;
      })
      .addCase(getPackageById.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setPackages,
  clearPackages,
  setCurrentPackage,
  addPackage,
  updatePackage,
  removePackage,
} = packageSlice.actions;

export default packageSlice.reducer;
