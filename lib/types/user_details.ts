import { OrderType } from "./enums";
import { IUserAddress } from "./user_address";


export interface CustomerDetails{
    name:string;
    phoneNumber:string,
    address:IUserAddress;
}

export interface DeliveryDetails {
  orderType: string;
  userLocation: {
    lat: number;
    lng: number;
  };
  isFreeDelivery: boolean;
  deliveryFee: number;
  deliverable: boolean;
}


export interface CreateCustomer {
  customer:CustomerDetails,
  orderType:OrderType
}

export interface CustomerOrder{
  customerDetails: CustomerDetails;
  orderType: OrderType;
}

export interface Customer extends CustomerDetails ,DeliveryDetails{}