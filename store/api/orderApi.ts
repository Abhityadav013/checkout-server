import { base_url } from "@/lib/apiEndPoint";
import {
  OrderSuccessSummary,
} from "@/lib/types/order_summary";
import ApiResponse from "@/utils/ApiResponse";
import { waitForIds } from "@/utils/fetchLocalStorage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    credentials: "include",

    prepareHeaders: async (headers) => {
      // wait up to ~3s total, checking each second
      const { tid, ssid } = await waitForIds(3, 1000);
      headers.set("Content-Type", "application/json");
      if (tid && ssid) {
        headers.set("x-device-id", ssid);
        headers.set("x-tid", tid);
      }
      return headers;
    },
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createOrder: builder.mutation<OrderSuccessSummary, any>({
      query: (body) => ({
        url: "/order",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<OrderSuccessSummary>) =>
        res.data || ({} as OrderSuccessSummary),
      invalidatesTags: ["Order"],
    }),
    getOrderById: builder.query<OrderSuccessSummary, string>({
      query: (orderId) => `/orders/${orderId}`,
      transformResponse: (res: ApiResponse<OrderSuccessSummary>) =>
        res.data || ({} as OrderSuccessSummary),
      providesTags: ["Order"],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderByIdQuery } = orderApi;
