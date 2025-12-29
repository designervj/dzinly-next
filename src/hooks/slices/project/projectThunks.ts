import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProjectModel } from '@/components/projects/projectModel';
import axios from 'axios';

// Thunk to get all projects
export const getAllProjects = createAsyncThunk<ProjectModel[]>(
  'project/getAllProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/projects');
      return response.data as ProjectModel[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to create a new project
export const createProject = createAsyncThunk<ProjectModel, Partial<ProjectModel>>(
  'project/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/projects', projectData);
      return response.data as ProjectModel;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
