// lib/rtk/sessionApi.ts
import { baseApi } from './baseApi';

type SessionIn = { tid: string | null; ssid: string | null };
type SessionOut = { data: { tid: string; deviceId: string } };

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrRestoreSession: builder.mutation<SessionOut, SessionIn>({
      query: (body) => ({
        url: '/session',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateOrRestoreSessionMutation } = sessionApi;
