/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Divider } from "@mui/material";
import {
  CreateCustomer,
  Customer,
  CustomerDetails,
} from "@/lib/types/user_details";
import { useSearchParams } from "next/navigation";
import { OrderType } from "@/lib/types/enums";
import { getIndianTadkaAddress } from "@/utils/getRestroAddress";
import { getCountryCallingCode } from "libphonenumber-js";
import {
  dialogHandlers,
  getDialogDataFromSession,
} from "@/utils/updateCustomerOrderDetails";
import UserInfo from "./UserInfo";
import DeliveryTime from "./DeliveryTime";
import DeliveryNote from "./DeliveryNote";
import OrderDetailsSkeleton from "./Skeletons/OrderDetailsSkeleton";
import AddressInfo from "./AddressInfo";
import { DialogType } from "@/lib/types/dialog_type";
import { OrderDetailsSummary } from "@/lib/types/order_details_type";
import {
  useFetchUserAddressesQuery,
  useSaveAddressMutation,
} from "@/store/api/addressApi";
import { BasketItem } from "@/lib/types/basket";

interface OrderDetailsProps {
  cart: {
    cartItems: BasketItem[];
    basketId: string;
    deviceId: string;
    tid: string;
  };
  userData: Customer;
}

// Helper type guard
function isAddressData(obj: unknown): obj is {
  pincode: string;
  buildingNumber: string;
  street: string;
  town: string;
} {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "pincode" in obj &&
    typeof (obj as any).pincode === "string" &&
    "buildingNumber" in obj &&
    typeof (obj as any).buildingNumber === "string" &&
    "street" in obj &&
    typeof (obj as any).street === "string" &&
    "town" in obj &&
    typeof (obj as any).town === "string"
  );
}

export default function OrderDetails({ cart, userData }: OrderDetailsProps) {
  const [openDialog, setOpenDialog] = useState<
    null | "contact" | "address" | "time" | "notes"
  >(null);
  const searchParams = useSearchParams(); // URLSearchParams
  const orderParam =
    searchParams.get("orderType") || userData.orderType || OrderType.DELIVERY; // Default to DELIVERY if not specified
  const handleOpen = (dialog: typeof openDialog) => setOpenDialog(dialog);
  const handleClose = () => setOpenDialog(null);

  useEffect(() => {
    if (cart.deviceId && cart.tid && typeof window !== "undefined") {
      localStorage.setItem("tid", cart.tid);
      localStorage.setItem("ssid", cart.deviceId);
    }
  }, [cart]);

  // --- Hydration-safe initial state ---
  // userInfo always from props
  const [userInfo, setUserInfo] = useState<{
    name: string;
    phoneNumber: string;
  }>({
    name: userData.name ?? "",
    phoneNumber: userData?.phoneNumber,
  });
  const { isLoading: loading, data } = useFetchUserAddressesQuery();
  const [customerDetails] = useState<CustomerDetails | null>(
    data?.customerDetails ?? null
  );
  // addressInfo: pickup = getIndianTadkaAddress, delivery = props
  const isPickup = orderParam === OrderType.PICKUP;
  const rawPickupAddress = getIndianTadkaAddress();
  const initialAddress = isPickup
    ? {
        pincode: String(rawPickupAddress.pincode || ""),
        buildingNumber: String(rawPickupAddress.buildingNumber || ""),
        street: String(rawPickupAddress.street || ""),
        town: String(rawPickupAddress.town || ""),
      }
    : {
        pincode: String(userData?.address?.pincode || ""),
        buildingNumber: String(userData?.address?.buildingNumber || ""),
        street: String(userData?.address?.street || ""),
        town: String(userData?.address?.town || ""),
      };

  const [addressInfo, setAddressInfo] = useState(initialAddress);
  // timeInfo: always { asap: true, scheduledTime: '' } on first render
  const [timeInfo, setTimeInfo] = useState<{
    asap: boolean;
    scheduledTime: string;
  }>({
    asap: true,
    scheduledTime: "",
  });
  // deliveryNoteInfo: only for delivery
  const [deliveryNoteInfo, setDeliveryNoteInfo] = useState<{ notes: string }>({
    notes: "",
  });

  const [saveAddress] = useSaveAddressMutation();
  const hasInitialized = useRef(false);
  const createUserDetails = useCallback(
    async ({ type }: { type: string }) => {
      const displayAddress = `${addressInfo.street} ${addressInfo.buildingNumber}, ${addressInfo.pincode} ${addressInfo.town}, Germany`;

      const updatedCustomerDetails: CustomerDetails = {
        name: userInfo.name,
        phoneNumber: `+${getCountryCallingCode("DE")}${
          userInfo.phoneNumber.split("-")[1]
        }`,
        address: {
          ...addressInfo,
          displayAddress,
        },
      };

      if (type === "contact") {
        const contactData = getDialogDataFromSession("contact") as {
          name: string;
          phoneNumber: string;
        };
        updatedCustomerDetails.name = contactData.name;
        updatedCustomerDetails.phoneNumber = `+${getCountryCallingCode("DE")}${
          contactData.phoneNumber.split("-")[1]
        }`;
      }
      if (type === "address") {
        const addressData = getDialogDataFromSession("address") as {
          pincode: string;
          buildingNumber: string;
          street: string;
          town: string;
        };
        const displayAddress = `${addressData.street} ${addressData.buildingNumber}, ${addressData.pincode} ${addressData.town}, Germany`;
        const address = {
          pincode: addressData.pincode,
          buildingNumber: addressData.buildingNumber,
          street: addressData.street,
          town: addressData.town,
        };
        updatedCustomerDetails.address = {
          ...address,
          displayAddress,
        };
      }

      // Determine what needs to be updated
      // const shouldUpdateUserInfo = hasUserInfoChanged();
      // const shouldUpdateAddress = hasAddressChanged();

      // if (!shouldUpdateUserInfo && !shouldUpdateAddress) {
      //   console.log("No changes detected. Skipping update.");
      //   return;
      // }

      const payload: CreateCustomer = {
        customer: updatedCustomerDetails,
        orderType: orderParam as OrderType,
      };
      await saveAddress(payload);

      // if (shouldUpdateUserInfo || shouldUpdateAddress) {

      //   if (shouldUpdateUserInfo) {
      //     setOriginalUserInfo(userInfo);
      //   }
      //   if (shouldUpdateAddress) {
      //     setOriginalAddressInfo(addressInfo);
      //   }
      // }
    },
    [orderParam, addressInfo, userInfo, saveAddress]
  );

  const handleDialogAction = useCallback(
    <T extends Exclude<DialogType, null>>(
      data: OrderDetailsSummary<T>
    ): void => {
      const handler = dialogHandlers[data.type];
      const storedData = handler(data.payload); // Get the stored data after calling the handler
      setOpenDialog(null);
      // Conditionally update the state based on the dialog type
      if (data.type === "contact") {
        // If 'contact' dialog, update user info
        const newData = storedData as { name: string; phoneNumber: string };
        const hasChanged =
          newData.name !== userInfo.name ||
          newData.phoneNumber !== userInfo.phoneNumber;
        setUserInfo(newData);
        if (hasChanged) createUserDetails({ type: "contact" }); // ✅ Update only if changed
      } else if (data.type === "address") {
        // If 'address' dialog, update address info
        const newData = storedData as {
          buildingNumber: string;
          street: string;
          pincode: string;
          town: string;
        };
        const hasChanged =
          newData.pincode !== addressInfo.pincode ||
          newData.buildingNumber !== addressInfo.buildingNumber ||
          newData.street !== addressInfo.street ||
          newData.town !== addressInfo.town;
        setAddressInfo(newData);
        if (hasChanged) createUserDetails({ type: "address" }); // ✅ Update only if changed
      } else if (data.type === "time") {
        // If 'time' dialog, you can add logic for time
        // For example:
        setTimeInfo(storedData as { scheduledTime: string; asap: boolean });
      } else if (data.type === "notes") {
        // If 'notes' dialog, handle notes info
        // For example:
        setDeliveryNoteInfo(storedData as { notes: string });
      }
    },
    [userInfo, addressInfo, createUserDetails]
  );

  useEffect(() => {
    // Only run when loading is false and on client
    if (!loading && customerDetails && !hasInitialized.current) {
      hasInitialized.current = true;
      // Only update from sessionStorage if DELIVERY (never for PICKUP)
      const contactData = getDialogDataFromSession("contact");
      const addressData = getDialogDataFromSession("address");
      const deliveryTimeData = getDialogDataFromSession("time");
      const deliverNoteData = getDialogDataFromSession("notes");
      // Use session if exists, else fallback to customerDetails
      if (contactData) {
        setUserInfo(contactData as { name: string; phoneNumber: string });
      } else if (customerDetails) {
        const fullNumber = `+${getCountryCallingCode("DE")}-${
          customerDetails.phoneNumber
        }`;
        handleDialogAction({
          type: "contact",
          payload: { name: customerDetails.name, phoneNumber: fullNumber },
        });
      }
      if (!isPickup) {
        if (isAddressData(addressData)) {
          setAddressInfo({
            pincode: String(addressData.pincode || ""),
            buildingNumber: String(addressData.buildingNumber || ""),
            street: String(addressData.street || ""),
            town: String(addressData.town || ""),
          });
        } else {
          handleDialogAction({
            type: "address",
            payload: {
              buildingNumber: String(
                (customerDetails.address &&
                  customerDetails.address.buildingNumber) ||
                  ""
              ),
              town: String(
                (customerDetails.address && customerDetails.address.town) || ""
              ),
              pincode: String(
                (customerDetails.address && customerDetails.address.pincode) ||
                  ""
              ),
              street: String(
                (customerDetails.address && customerDetails.address.street) ||
                  ""
              ),
            },
          });
        }
      }

      if (deliveryTimeData) {
        setTimeInfo(
          deliveryTimeData as { scheduledTime: string; asap: boolean }
        );
      }
      if (deliverNoteData) {
        setDeliveryNoteInfo(deliverNoteData as { notes: string });
      }
    }
  }, [loading, customerDetails, isPickup, handleDialogAction]);
  const isDataReady =
    userInfo.name &&
    userInfo.phoneNumber &&
    addressInfo.pincode &&
    addressInfo.buildingNumber &&
    addressInfo.street &&
    addressInfo.town;
  return isDataReady ? (
    <div className="bg-white rounded-lg  mt-10 shadow p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Order details</h2>

      <UserInfo
        openDialog={openDialog}
        handleOpen={handleOpen}
        handleClose={handleClose}
        customerDetails={userInfo}
        handleDialogAction={handleDialogAction}
      />
      <Divider sx={{ backgroundColor: "#E0E0E0", mb: 1 }} />

      <AddressInfo
        isPickup={orderParam === OrderType.PICKUP}
        openDialog={openDialog}
        customerAddress={addressInfo}
        handleOpen={handleOpen}
        handleClose={handleClose}
        handleDialogAction={handleDialogAction}
      />
      <Divider sx={{ backgroundColor: "#E0E0E0", mb: 1 }} />

      <DeliveryTime
        isPickup={orderParam === OrderType.PICKUP}
        openDialog={openDialog}
        initialTime={timeInfo?.scheduledTime ?? ""}
        handleOpen={handleOpen}
        handleClose={handleClose}
        handleDialogAction={handleDialogAction}
      />
      {orderParam === OrderType.DELIVERY && (
        <>
          <Divider sx={{ backgroundColor: "#E0E0E0", mb: 1 }} />

          <DeliveryNote
            openDialog={openDialog}
            deliveryNote={deliveryNoteInfo}
            handleOpen={handleOpen}
            handleClose={handleClose}
            handleDialogAction={handleDialogAction}
          />
        </>
      )}
    </div>
  ) : (
    <OrderDetailsSkeleton />
  );
}
