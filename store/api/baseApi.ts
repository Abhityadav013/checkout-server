// lib/rtk/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.API_BASE_URL || "http://localhost:4000";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1`,
    credentials: "include", // include cookies if backend sets them
    prepareHeaders: (headers) => {
      const tid = localStorage.getItem("tid");
      const ssid = localStorage.getItem("ssid");
      headers.set("Content-Type", "application/json");
      if (ssid && tid) {
        headers.set("x-device-id", ssid);
        headers.set("x-tid", tid);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
