// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { OrderType } from '@/lib/types/order_type';

// interface OrderState {
//   orderType: OrderType;
// }

// const initialState: OrderState = {
//   orderType: OrderType.DELIVERY, // or default from sessionStorage if preferred
// };

// export const orderSlice = createSlice({
//   name: 'order',
//   initialState,
//   reducers: {
//     setOrderType(state, action: PayloadAction<OrderType>) {
//       state.orderType = action.payload;
//     },
//   },
// });

// export const { setOrderType } = orderSlice.actions;
// export default orderSlice.reducer;
