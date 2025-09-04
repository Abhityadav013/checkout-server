// src/redux/services/cartApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { base_url } from "@/lib/apiEndPoint";
import { BasketItem } from "@/lib/types/basket";
import { GetCartData } from "@/lib/types/cart_data.type";
import { waitForIds } from "@/utils/fetchLocalStorage";

// ----- Types matching your API envelope -----
type ApiEnvelope<T> = {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
};

type CartDataPayload = {
  id?: string;
  cartItems?: BasketItem[];
  basketId?: string;
};

// GET can return {}, null, or a cart object
type GetCartEnvelope = ApiEnvelope<CartDataPayload | object | null>;

// POST can return null when cart cleared, or a cart object when updated
type UpdateCartEnvelope = ApiEnvelope<CartDataPayload | null>;

// Stable client-side shape
const DEFAULT_CART_DATA: GetCartData = {
  cartItems: [],
  basketId: "",
};

// Normalize any server payload into the stable client-side shape
function normalizeCartData(
  input: CartDataPayload | object | null | undefined
): GetCartData {
  if (input && typeof input === "object" && "cartItems" in input) {
    const d = input as CartDataPayload;
    return {
      cartItems: Array.isArray(d.cartItems) ? d.cartItems : [],
      basketId: typeof d.basketId === "string" ? d.basketId : "",
    };
  }
  // Covers {} and null
  return { ...DEFAULT_CART_DATA };
}

// ----- RTK Query slice -----
export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    credentials: "include",
    prepareHeaders: async (headers) => {
      // Only access localStorage in the browser
      const { tid, ssid } = await waitForIds(3, 1000);
      headers.set("Content-Type", "application/json");
      if (tid && ssid) {
        headers.set("x-device-id", ssid);
        headers.set("x-tid", tid);
      }
      return headers;
    },
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    // GET /cart
    getCart: builder.query<GetCartData, void>({
      query: () => "/cart",
      transformResponse: (res: GetCartEnvelope): GetCartData => {
        return normalizeCartData(res?.data);
      },
      providesTags: ["Cart"],
      // Optional: ensure refetch on re-mount
      // refetchOnMountOrArgChange: true,
    }),

    // POST /cart
    updateCart: builder.mutation<
      GetCartData,
      { cart: BasketItem[]; isCartEmpty?: boolean }
    >({
      query: ({ cart, isCartEmpty }) => ({
        url: "/cart",
        method: "POST",
        body: { cart, isCartEmpty },
      }),
      // Optimistic update + sync with server result
      async onQueryStarted(
        { cart, isCartEmpty },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            if (!draft) return;
            if (isCartEmpty) {
              draft.cartItems = [];
              draft.basketId = "";
            } else {
              draft.cartItems = cart ?? [];
              // leave basketId unchanged until server responds
            }
          })
        );

        try {
          const { data } = await queryFulfilled; // data is GetCartData after transformResponse
          // Ensure cache reflects authoritative server result (e.g., basketId changes)
          dispatch(
            cartApi.util.updateQueryData("getCart", undefined, (draft) => {
              draft.cartItems = data.cartItems;
              draft.basketId = data.basketId;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
      transformResponse: (res: UpdateCartEnvelope): GetCartData => {
        return normalizeCartData(res?.data);
      },
    }),
  }),
});

export const { useGetCartQuery, useUpdateCartMutation } = cartApi;
