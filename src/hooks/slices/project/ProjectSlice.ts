import { ProjectModel } from '@/components/projects/projectModel';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllProjects, createProject, ProjectResponse } from './projectThunks';


interface ProjectState {
  currentProject: ProjectModel | null;
  projects: ProjectModel[];
  hasFetched: boolean;
  isLoading: boolean;
  error?: string | null;
  uploadedImagePath:string| null;
}

const initialState: ProjectState = {
  currentProject: null,
  projects: [],
  hasFetched: false,
  isLoading: false,
  error: null,
  uploadedImagePath:null
};


const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setUploadImagePath:(state,action)=>{
      state.uploadedImagePath=action.payload
    },
    resetUploadImagePath:(state,action)=>{
  state.uploadedImagePath= null
    },
    updateProjectList:(state,action)=>{
     state.projects.push(action.payload)
    },
    setHasFetched(state, action) {
      state.hasFetched = true;
      state.projects= action.payload
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
     setCurrentProject:(state,action)=>{
      state.currentProject=action.payload
    }, resetCurrentPorject:(state,action)=>{
      state.currentProject=null
    },
    resetProject(state) {
      state.currentProject = null;
      state.hasFetched = false;
      state.isLoading = false;
      state.error = null;
      state.projects = [];
      state.uploadedImagePath=null
    },
   
  
  },
  extraReducers: (builder) => {
    builder
      // getAllProjects
      .addCase(getAllProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllProjects.fulfilled, (state, action: PayloadAction<ProjectModel[]>) => {
        state.isLoading = false;
        state.hasFetched = true;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch projects';
      })
      // createProject
      // .addCase(createProject.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      // .addCase(createProject.fulfilled, (state, action: PayloadAction<ProjectResponse>) => {
      //   state.isLoading = false;
      //   state.projects.push(action.payload.data);
      //   state.error = null;
      // })
      // .addCase(createProject.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload as string || 'Failed to create project';
      // });
  },
});

export const { 
  setUploadImagePath,resetUploadImagePath,
  setCurrentProject,resetCurrentPorject,
  updateProjectList,
  setHasFetched, setIsLoading, resetProject } = projectSlice.actions;
export default projectSlice.reducer;
