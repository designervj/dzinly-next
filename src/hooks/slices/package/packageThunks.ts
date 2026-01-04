import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { PackageModel } from '@/components/admin/users/package/packageType';
import { ObjectId } from 'mongodb';

export interface PackageResponse {
  data: PackageModel;
  success: boolean;
}

// Thunk to get all packages
export const getAllPackages = createAsyncThunk<PackageModel[]>(
  'package/getAllPackages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/users/packages');
      // API returns { packages: PackageModel[], count: number }
      return response.data.packages || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to create a new package
export const createPackage = createAsyncThunk<
  PackageResponse,
  Partial<PackageModel>,
  { rejectValue: any }
>(
  'package/createPackage',
  async (packageData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/admin/users/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData),
      });
      const data = await response.json();
      return {
        data: data as PackageModel,  
        success: true,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to update a package
export const updatePackage = createAsyncThunk<
  PackageResponse,
  Partial<PackageModel>,
  { rejectValue: any }
>(
  'package/updatePackage',
  async (packageData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/admin/users/packages', packageData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return {
        data: response.data as PackageModel,
        success: true,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to delete a package
export const deletePackage = createAsyncThunk<
  { _id: ObjectId | string },
  string,
  { rejectValue: any }
>(
  'package/deletePackage',
  async (_id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/admin/users/packages?id=${_id}`);
      return { _id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to get a single package by ID
export const getPackageById = createAsyncThunk<
  PackageModel,
  string,
  { rejectValue: any }
>(
  'package/getPackageById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/admin/users/packages/${id}`);
      return response.data as PackageModel;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
