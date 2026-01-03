import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TabState {
  activeTab?: string;
}

const initialState: TabState = {
  activeTab: "inspiration",
};

const tabSlice = createSlice({
  name: 'tabContent',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string | undefined>) => {
      state.activeTab = action.payload;
    },
    clearActiveTab: (state) => {
      state.activeTab = "inspiration";
    },
  },
});

export const { setActiveTab, clearActiveTab } = tabSlice.actions;
export default tabSlice.reducer;
