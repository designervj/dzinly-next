import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUser } from '@/models/user';

// Thunk to create a customer
export const createCustomer = createAsyncThunk<
  IUser,
  Partial<IUser>,
  { rejectValue: any }
>(
  'user/createCustomer',
  async (userData, { rejectWithValue }) => {
    try {
      const payload = {
        ...userData,
        password: userData.passwordHash,
      };
      delete payload.passwordHash;
      const response = await axios.post('/api/admin/customer', payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to get all users
export const getAllUser = createAsyncThunk<IUser[]>(
  'user/getAllUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/users');
      // API returns { users: IUser[] } with superadmin filtered out
      
       console.log("response user all", response)
      return response.data.users;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
