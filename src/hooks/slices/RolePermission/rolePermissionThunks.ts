import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RolePermissionModel } from '@/components/onboarding/RolePermisionModel';

export const fetchRolePermissions = createAsyncThunk<RolePermissionModel[]>('rolePermission/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/rolesandpermissions');
    return response.data.roles;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const createRolePermission = createAsyncThunk<RolePermissionModel, Partial<RolePermissionModel>>('rolePermission/create', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/role-permissions', data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateRolePermission = createAsyncThunk<RolePermissionModel, Partial<RolePermissionModel>>('rolePermission/update', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.put('/api/role-permissions', data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteRolePermission = createAsyncThunk<{ id: string }, string>('rolePermission/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/role-permissions?id=${id}`);
    return { id };
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
