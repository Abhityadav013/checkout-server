// services/addressApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse, ValidationErrorResponse } from "@/lib/types/api_response";
import {
  CreateCustomer,
  CustomerDetails,
  DeliveryDetails,
} from "@/lib/types/user_details";
import { isValidationErrorResponse } from "@/utils/ApiResponse";
import { base_url } from "@/lib/apiEndPoint";
import { waitForIds } from "@/utils/fetchLocalStorage";

export const addressApi = createApi({
  reducerPath: "addressApi",
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
  tagTypes: ["Delivery"], // add this
  endpoints: (builder) => ({
    // Fetch user addresses

    fetchUserAddresses: builder.query<{ customerDetails: CustomerDetails; hasAddress: boolean },void>({
      query: () => "/user-details/details",
      transformResponse: (
        res: ApiResponse<{
          customerDetails: CustomerDetails;
          hasAddress: boolean;
        }>
      ) => res.data,
    }),

    fetchUserDelivery: builder.query<DeliveryDetails, void>({
      query: () => "/user-details/delivery",
      transformResponse: (res: ApiResponse<DeliveryDetails>) => res.data,
      providesTags: ["Delivery"], // provide the tag
    }),

    // Save or update an address
    saveAddress: builder.mutation<ApiResponse<CustomerDetails>, CreateCustomer>(
      {
        query: (address) => ({
          url: "/user-details/create",
          method: "POST",
          body: address,
        }),
        transformResponse: (
          response: ValidationErrorResponse | ApiResponse<CustomerDetails>
        ) => {
          if (isValidationErrorResponse(response)) {
            throw response; // Throw validation errors to component
          }
          return response as ApiResponse<CustomerDetails>;
        },
        invalidatesTags: ["Delivery"], // invalidate to auto-refetch
      }
    ),
  }),
});

export const {
  useFetchUserAddressesQuery,
  useFetchUserDeliveryQuery,
  useSaveAddressMutation,
} = addressApi;
