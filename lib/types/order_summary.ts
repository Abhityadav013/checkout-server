
import { BasketItem } from "./basket";
import { OrderStatus, OrderType, SpicyLevel } from "./enums";
import { PaymentMethod } from "./payment_method_type";

export type OrderItemSummary = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  customization?: Customization;
};

export interface Customization {
  notes?: string;
  options?: string[];
  spicyLevel?: SpicyLevel;
}

export type OrderSuccessSummary = {
  displayId: string;
  orderId: string;
  orderType: OrderType;
  selectedMethod: PaymentMethod;
  orderItems: OrderItemSummary[];
  orderAmount: {
    orderTotal: number;
    deliveryFee: number;
    serviceFee: number;
    tipAmount: number;
    discount?: {
      amount: number;
      code: string;
    };
  };
  deliveryTime: { asap: boolean; scheduledTime: string };
  deliveryNote?: string;
  deliveryAddress?: string;
  createdAt: Date | string;
  status: OrderStatus;
  userName: string;
  userPhone: string;
};

export interface CreateOrderRequest {
  orderDetails: BasketItem[];
  orderType: OrderType;
  selectedMethod: PaymentMethod;
  paymentIntentId?: string | null;
  deliveryFee: number;
  tipAmount: number;
  serviceFee: number;
  deliveryAddress?: string;
  discount?: {
    amount: number;
    code: string;
  };
  deliveryTime: { asap: boolean; scheduledTime: string };
  deliveryNote?: string;
  userName: string;
  userPhone: string;
}
