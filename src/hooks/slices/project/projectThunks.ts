
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AnalyseImageModel, ProjectModel } from '@/components/projects/projectModel';
import axios from 'axios';


export interface ProjectResponse{
  data:ProjectModel,
  success:boolean
}


export interface SegmentStats {
  area_px: number;
  perimeter_px: number;
}

export interface SegmentCenter {
  x: number;
  y: number;
}
export interface SegmentResult {
  label: string;
  score: number;
  box: number[];
  polygon: number[][];
  center: SegmentCenter;
  stats: SegmentStats;
  mask_url:string;
}
export interface AnnotationApiResponse {
  status: string;
  composite_url:string;
  results: SegmentResult[];
}

const BASE_URL = 'https://mahimavalenza.in/api/v1';
   

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
export const createProject = createAsyncThunk<ProjectResponse, Partial<ProjectModel>>(
  'project/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/projects', projectData);
      return {
        data:response.data as ProjectModel,
        success:true
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to update a project
export const updateProject = createAsyncThunk<ProjectResponse, Partial<ProjectModel>>(
  'project/updateProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/projects', projectData);
      return {
        data: response.data as ProjectModel,
        success: true
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProjectAnalysis = createAsyncThunk<ProjectResponse, { url: string; id: string }>(
  "projects/updateProjectAnalysis",
  async ({ url, id }: { url: string; id: string }, { rejectWithValue }) => {
    try {
     const responseAnalysis = await axios.post(
        `https://nexus.dzinly.org/api/v1/ai/ai/analyse-house`,
        { url },
        {
          headers: {
            Accept: "application/json",
            "X-API-Key": "dorg_sk_ioLOcqR2HTPtXNv44ItBW3RCL4NjLeuWitgP-vJuO3s",
            "Content-Type": "application/json",
          },
        }
      );

      // const respData= responseAnalysis.data
      
      // const response = await ProjectAPI.save_analysed_data(id, data);
      
      return{
        success:true,
        data:responseAnalysis.data
      } 
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to update project"
      );
    }
  }
);

export const fetchAnnotationApiResponse = createAsyncThunk<
  AnnotationApiResponse,
  { imageUrl: string; project_id:string; analysis_summary?: AnalyseImageModel },
  { rejectValue: string }
>(
  "studio/fetchAnnotationApiResponse",
  async ({ imageUrl, project_id, analysis_summary }, { rejectWithValue }) => {
    try {
      const payload = {
        image_url: imageUrl,
        project_id,
        analysis_summary,
      };
      const response = await axios.post(`${BASE_URL}/annotations/annotation/detect-segments`, payload);
      return response.data as AnnotationApiResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);