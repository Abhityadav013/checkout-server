/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { OrderType } from "@/lib/types/enums";
import { ErrorResponse } from "@/lib/types/error_type";
import React, { useState } from "react";
import AddNewAddress from "./AddAddress";
import { CreateCustomer, CustomerDetails } from "@/lib/types/user_details";
import { useSaveAddressMutation } from "@/store/api/addressApi";
import isEqual from "lodash/isEqual";
interface AddressFormProps {
  customerDetails: CustomerDetails;
  hasAddress: boolean;
  isDelivery: boolean;
  handleBasketType: (currentIsDelivery: boolean) => void;
  setAddressModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomerDetails: React.Dispatch<React.SetStateAction<CustomerDetails>>;
}
const AddressForm = ({
  customerDetails,
  hasAddress,
  isDelivery,
  handleBasketType,
  setAddressModelOpen,
  setCustomerDetails,
}: AddressFormProps) => {
  const [saveAddress] = useSaveAddressMutation();
  const [formError, setFormError] = useState<ErrorResponse>([]);

  const handleAdddressDetailClose = () => {
    setAddressModelOpen(false);
  };
  const onSubmit = async (values: {
    userInfo: any;
    orderType: OrderType;
    address?: any;
  }) => {
    let userAddress = {
      displayAddress: "",
      buildingNumber: "",
      street: "",
      town: "",
      pincode: "",
    };

    if (values.address) {
      userAddress = {
        displayAddress: `${values.address?.street} ${
          values.address?.buildingNumber
        }, ${values.address?.pincode} ${values.address.town ?? ""}, Germany`,
        buildingNumber: values.address?.buildingNumber ?? "",
        street: values.address?.street ?? "",
        town: values.address?.town ?? "",
        pincode: values.address?.pincode ?? "",
      };
    }
    const struc_phone = values.userInfo.phoneNumber.split("+49")[1] ?? "";
    const customerDetails: CreateCustomer = {
      customer: {
        name: values.userInfo.name,
        phoneNumber: struc_phone,
        address: userAddress,
      },
      orderType: values.orderType,
    };
    try {
      setCustomerDetails((prev) =>
        isEqual(prev, customerDetails.customer)
          ? prev
          : customerDetails.customer
      );
      const response = await saveAddress(customerDetails).unwrap();
      console.log("Saved address:", response);
      setAddressModelOpen(false);
      setFormError([]);
    } catch (err: any) {
      console.log("Error saving address:", err);
      setFormError(err?.data.data || [{ message: "Something went wrong" }]);
    }
  };

  return (
    <div>
      <AddNewAddress
        formValues={customerDetails ?? {}}
        onSubmit={onSubmit}
        isOpen={hasAddress} // Replace with actual model state
        onClose={() => handleAdddressDetailClose()}
        address={customerDetails?.address ?? {}}
        isDelivery={isDelivery}
        onToggleDelivery={() => handleBasketType(isDelivery)}
        error={formError}
        setFormError={setFormError}
      />
    </div>
  );
};

export default AddressForm;
