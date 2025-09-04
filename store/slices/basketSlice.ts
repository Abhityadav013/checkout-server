import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface BasketState {
  isBasketOpen: boolean;
}

const initialState: BasketState = {
  isBasketOpen: false
};

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    handleBasketState(state, action: PayloadAction<boolean>) {
      state.isBasketOpen = action.payload;
    },
  },
});

export const { handleBasketState } = basketSlice.actions;
export default basketSlice.reducer;
