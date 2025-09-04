// // services/customerDetailsApi.ts
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import ApiResponse, { isValidationErrorResponse } from '@/utils/ApiResponse';
// import { CustomerDetails, CustomerOrder } from '@/lib/types/customer_order_type';
// import { UserLocation } from '@/lib/types/user_location_type';
// import { ValidationErrorResponse } from '@/lib/types/api_response';
// import { base_url } from '@/lib/apiEndpoints';

// export const customerDetailsApi = createApi({
//   reducerPath: 'customerDetailsApi',
//    baseQuery: fetchBaseQuery({
//       baseUrl: base_url,
//       credentials: 'include',
//       prepareHeaders: (headers) => {
//         // Retrieve token from localStorage
//         const tid = localStorage.getItem('tid');
//         const ssid = localStorage.getItem('ssid');
  
//         // If a token exists, add it to the Authorization header
//         if (tid) headers.set('tid', tid);
//         if (ssid) headers.set('ssid', ssid);
  
//         return headers;
//       },
//     }),
//   endpoints: (builder) => ({
//     fetchCustomerDetails: builder.query<CustomerOrder, void>({
//       query: () => '/user-details',
//       transformResponse: (res: ApiResponse<CustomerOrder>) => res.data
//     }),
//     updateCustomerDetails: builder.mutation<ApiResponse<CustomerOrder>, CustomerOrder>({
//       query: (customerOrder) => ({
//         url: '/user-details',
//         method: 'POST',
//         body: customerOrder,
//       }),
//       // When the mutation response is returned, check for validation errors.
//       // If there are validation errors, we will throw them to be caught by the component.
//       transformResponse: (response: ValidationErrorResponse | ApiResponse<CustomerDetails>) => {        
//         isValidationErrorResponse(response)
//         return response as unknown as ApiResponse<CustomerOrder>; // Cast the response to 'unknown' first, then to the expected type
//       },
//     }),

//     fetchCustomerLocation: builder.query<UserLocation, void>({
//       query: () => ({
//         url: '/user-location',
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Session-Id': localStorage.getItem('ssid') || '',
//           Tid: localStorage.getItem('tid') || '',
//         },
//       }),
//     }),
//   }),
// });

// export const {
//   useFetchCustomerDetailsQuery,
//   useUpdateCustomerDetailsMutation,
//   useFetchCustomerLocationQuery,
// } = customerDetailsApi;
