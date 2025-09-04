// import { base_url } from '@/lib/apiEndpoints';
// import { CreateOrderRequest, OrderSuccessSummary } from '@/lib/types/order_summary';
// import ApiResponse from '@/utils/ApiResponse';
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const orderApi = createApi({
//   reducerPath: 'orderApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: base_url,
//     credentials: 'include',
//     prepareHeaders: (headers) => {
//       const tid = localStorage.getItem('tid');
//       const ssid = localStorage.getItem('ssid');

//       if (tid) headers.set('tid', tid);
//       if (ssid) headers.set('ssid', ssid);

//       return headers;
//     },
//   }),
//   tagTypes: ['Order'],
//   endpoints: (builder) => ({
//     createOrder: builder.mutation<OrderSuccessSummary, CreateOrderRequest>({
//       query: (body) => ({
//         url: '/create-order-success',
//         method: 'POST',
//         body,
//       }),
//       transformResponse: (res: ApiResponse<OrderSuccessSummary>) =>
//         res.data || ({} as OrderSuccessSummary),
//       invalidatesTags: ['Order'],
//     }),
//     getOrderById: builder.query<OrderSuccessSummary, string>({
//       query: (orderId) => `/orders/${orderId}`,
//       transformResponse: (res: ApiResponse<OrderSuccessSummary>) =>
//         res.data || ({} as OrderSuccessSummary),
//       providesTags: ['Order'],
//     }),
//   }),
// });

// export const { useCreateOrderMutation, useGetOrderByIdQuery } = orderApi;
