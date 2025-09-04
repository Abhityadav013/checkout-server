import { BasketItem } from "./basket"

export type GetCartData = {
    deviceId:string;
    tid:string
    cartItems:BasketItem[];
    basketId:string
}