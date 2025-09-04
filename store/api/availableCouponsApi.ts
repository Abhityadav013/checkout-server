// import { base_url } from '@/lib/apiEndpoints';
// import { GetCouponData, GetCouponResponse } from '@/lib/types/availabelCoupons';
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const availableCouponApi = createApi({
//   reducerPath: 'availableCouponApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: base_url,
//     credentials: 'include',
//   }),
//   tagTypes: ['Coupon'],
//   endpoints: (builder) => ({
//     getAvailableCoupons: builder.query<GetCouponData, void>({
//       query: () => '/available-coupons',
//       transformResponse: (res: GetCouponResponse) => res.data || ({} as GetCouponData),
//       providesTags: ['Coupon'],
//     }),
//   }),
// });

// export const { useGetAvailableCouponsQuery  } = availableCouponApi;
