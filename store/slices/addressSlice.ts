import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserLocation {
  lat: number;
  lng: number;
}

export interface OrderData {
  orderType: string;
  deliverable: boolean;
  isFreeDelivery: boolean;
  deliveryFee: number;
  userLocation: UserLocation;
}

export interface UserDeliveryDetailState {
  statusCode: number | null;
  data: OrderData;
  message: string;
  success: boolean;
  loading: boolean;
  addressModel: boolean;
  error: string | null;
}

const initialState: UserDeliveryDetailState = {
  statusCode: null,
  data: {
    orderType: "",
    deliverable: false,
    isFreeDelivery: false,
    deliveryFee: 0,
    userLocation: {
      lat: 0,
      lng: 0,
    },
  },
  message: "",
  addressModel: false,
  success: false,
  loading: false,
  error: null,
};

const userDeliveryDetailSlice = createSlice({
  name: "userDeliveryDetail",
  initialState,
  reducers: {
    fetchUserDeliveryDetailStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserDeliveryDetailSuccess: (
      state,
      action: PayloadAction<UserDeliveryDetailState>
    ) => {
      state.loading = false;
      state.statusCode = action.payload.statusCode;
      state.data = action.payload.data;
      state.message = action.payload.message;
      state.success = action.payload.success;
      state.error = null;
    },
    fetchUserDeliveryDetailFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setUserDeliveryDetail: (state, action: PayloadAction<OrderData>) => {
      state.data = action.payload;
    },
    openAddressModel: (
      state,
      action: PayloadAction<{ isDeliveryAddressUpdating: boolean }>
    ) => {
      state.loading = true;
      state.addressModel = action.payload.isDeliveryAddressUpdating;
    },
    closeAddressModel: (state) => {
      state.loading = true;
      state.addressModel = false;
    },
    resetUserDeliveryDetail: () => initialState,
  },
});

export const {
  fetchUserDeliveryDetailStart,
  fetchUserDeliveryDetailSuccess,
  fetchUserDeliveryDetailFailure,
  setUserDeliveryDetail,
  resetUserDeliveryDetail,
  closeAddressModel,
  openAddressModel,
} = userDeliveryDetailSlice.actions;

export default userDeliveryDetailSlice.reducer;
