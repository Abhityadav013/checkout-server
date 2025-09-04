

import { PaymentMethod } from "@/lib/types/payment_method_type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentMethodState {
  payment_type: PaymentMethod;
}

const initialState: PaymentMethodState = {
  payment_type: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.payment_type = action.payload;
    },
  },
});

export const { setPaymentMethod } = paymentSlice.actions;
export default paymentSlice.reducer;
