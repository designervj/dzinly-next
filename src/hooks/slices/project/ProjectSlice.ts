import { ProjectModel } from '@/components/projects/projectModel';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllProjects, createProject } from './projectThunks';


interface ProjectState {
  currentProject: ProjectModel | null;
  projects: ProjectModel[];
  hasFetched: boolean;
  isLoading: boolean;
  error?: string | null;
}

const initialState: ProjectState = {
  currentProject: null,
  projects: [],
  hasFetched: false,
  isLoading: false,
  error: null,
};


const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
   
    setHasFetched(state, action: PayloadAction<boolean>) {
      state.hasFetched = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    resetProject(state) {
      state.currentProject = null;
      state.hasFetched = false;
      state.isLoading = false;
      state.error = null;
      state.projects = [];
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
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<ProjectModel>) => {
        state.isLoading = false;
        state.projects.push(action.payload);
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to create project';
      });
  },
});

export const { setHasFetched, setIsLoading, resetProject } = projectSlice.actions;
export default projectSlice.reducer;
