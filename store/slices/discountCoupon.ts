

// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface CouponState {
//   availableCoupons: AvailableCoupons[];
//   appliedCoupon: AvailableCoupons | null;
//   cartAmount: number;
//   finalCartAmount: number;
//   errorMessage: string | null;
// }

// const initialState: CouponState = {
//   availableCoupons: [],
//   appliedCoupon: null,
//   cartAmount: 0,
//   finalCartAmount: 0,
//   errorMessage: null,
// };

// const couponSlice = createSlice({
//   name: 'coupon',
//   initialState,
//   reducers: {
//     setAvailableCoupons(state, action: PayloadAction<AvailableCoupons[]>) {
//       state.availableCoupons = action.payload;
//     },

//     setCartAmount(state, action: PayloadAction<number>) {
//       state.cartAmount = action.payload;
//       state.finalCartAmount = state.appliedCoupon
//         ? calculateCouponDiscount(action.payload, state.appliedCoupon.discount)
//         : action.payload;
//     },

//     applyCoupon(state, action: PayloadAction<string>) {
//       const couponLabel = action.payload;
//       const now = new Date();
//       const coupon = state.availableCoupons.find(c => c.label === couponLabel);

//       if (coupon) {
//         const isValid =
//           new Date(coupon.startAt) <= now && now <= new Date(coupon.endBy);

//         if (isValid) {
//           const discounted =  calculateCouponDiscount(state.cartAmount,coupon.discount,coupon.discountType,coupon.minDiscount,coupon.maxDiscount)
//           state.finalCartAmount = discounted;
//           state.appliedCoupon = coupon;
//           state.errorMessage = null;
//           sessionStorage.setItem('finalCartAmount', discounted.toString());
//         } else {
//           state.errorMessage = 'Coupon is not valid at this time.';
//         }
//       } else { 
//         state.finalCartAmount = state.cartAmount
//         state.errorMessage = 'Coupon not found.';
//       }
//     },

//     removeCoupon(state) {
//       state.appliedCoupon = null;
//       state.finalCartAmount = state.cartAmount;
//       state.errorMessage = null;
//       sessionStorage.setItem('finalCartAmount', state.cartAmount.toString());
//     },
//   },
// });

// export const {
//   setAvailableCoupons,
//   setCartAmount,
//   applyCoupon,
//   removeCoupon,
// } = couponSlice.actions;

// export default couponSlice.reducer;
