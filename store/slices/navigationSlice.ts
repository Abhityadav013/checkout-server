// store/navigationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigationState {
  targetPath: string | null;
}

const initialState: NavigationState = {
  targetPath: null,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    startNavigation: (state, action: PayloadAction<string>) => {
      state.targetPath = action.payload;
    },
    endNavigation: (state) => {
      state.targetPath = null;
    },
  },
});

export const { startNavigation, endNavigation } = navigationSlice.actions;
export default navigationSlice.reducer;
