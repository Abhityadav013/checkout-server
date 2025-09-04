import { base_url } from "@/lib/apiEndPoint";
import { cookies } from "next/headers";

interface FetchParams {
  [key: string]: string | number | boolean;
}
export async function fetchFromApi<T>(
  endpoint: string,
  isCached: boolean,
  params?: FetchParams, // Optional query parameters
  headers?:{deviceId: string,tid:string}
): Promise<T> {
  // Construct query string if params are passed

  const cookieStore = await cookies();

  const deviceId = cookieStore.get("ssid");
  const tid = cookieStore.get("tid");

  const _device_id = headers ? headers.deviceId : deviceId ? deviceId.value : "";
  const _tid_ = headers ? headers.tid : tid ? tid.value : "";

  const queryString = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, value.toString()])
      ).toString()
    : "";
  // Fetch request with query parameters (if provided)
  const res = await fetch(`${base_url}${endpoint}${queryString}`, {
    credentials: "include",
    headers: {
      "x-device-id": _device_id,
      "x-tid": _tid_,
    },
    ...(isCached
      ? { next: { revalidate: 3600 } }
      : { next: { revalidate: 0 } }),
    // next: { tags: ['cart'] },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  const data = await res.json();

  return data.data; // assuming ApiResponse<T> shape
}

