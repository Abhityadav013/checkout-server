import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MobileViewState {
  isMobile: boolean;
}

const initialState: MobileViewState = {
  isMobile: false,
};

const mobileSlice = createSlice({
  name: "mobile",
  initialState,
  reducers: {
    setMobileView: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
  },
});

export const { setMobileView } = mobileSlice.actions;
export default mobileSlice.reducer;
