import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RolePermissionModel } from '@/components/onboarding/RolePermisionModel';
import { createRolePermission, deleteRolePermission, fetchRolePermissions, updateRolePermission } from './rolePermissionThunks';

export interface RolePermissionState {
  rolesPermissions: RolePermissionModel[];
  hasFetched:boolean;
  current?: RolePermissionModel;
  loading: boolean;
  error?: string;
}

const initialState: RolePermissionState = {
  rolesPermissions: [],
  loading: false,
  hasFetched:false
};



const rolePermissionSlice = createSlice({
  name: 'rolePermission',
  initialState,
  reducers: {
    setCurrentRolePermission(state, action: PayloadAction<RolePermissionModel | undefined>) {
      state.current = action.payload;
    },
    updateRolePermissions:(state,action)=>{
  state.rolesPermissions= action.payload
  state.hasFetched=true
    },
    addRoles:(state, action)=>{
        state.rolesPermissions.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRolePermissions.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchRolePermissions.fulfilled, (state, action) => {
        state.rolesPermissions = action.payload;
        state.loading = false;
        state.hasFetched=true
      })
      .addCase(fetchRolePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createRolePermission.fulfilled, (state, action) => {
        state.rolesPermissions.push(action.payload);
      })
      .addCase(updateRolePermission.fulfilled, (state, action) => {
        state.rolesPermissions = state.rolesPermissions.map(item => item.id === action.payload.id ? action.payload : item);
      })
      .addCase(deleteRolePermission.fulfilled, (state, action) => {
        state.rolesPermissions = state.rolesPermissions.filter(item => item.id !== action.payload.id);
      });
  },
});

export const { setCurrentRolePermission,addRoles,
    updateRolePermissions
 } = rolePermissionSlice.actions;
export default rolePermissionSlice.reducer;
