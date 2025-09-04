import { fetchFromApi } from "@/utils/fetchAPIcall";
import { MenuItem } from "../types/menu";
import { CategoryWithItems } from "../types/categoryItems";
import { MenuCategory } from "../types/category";
import {
  Customer,
  CustomerDetails,
  DeliveryDetails,
} from "../types/user_details";
import { Info } from "../types/restro_info";
import { GetCartData } from "../types/cart_data.type";

export class ApiService {
  static async fetchCategories(): Promise<MenuCategory[]> {
    try {
      const categoryData = await fetchFromApi<MenuCategory[]>(
        `/category/listing`,
        false
      );

      return categoryData;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  }

  static async fetchMenuItems(): Promise<MenuItem[]> {
    try {
      const menuItemsRaw = await fetchFromApi<MenuItem[]>(
        `/menu/listing`,
        true
      );
      return menuItemsRaw;
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
      throw error;
    }
  }

  // Alternative method that fetches categories and items separately and combines them
  static async fetchMenuData(): Promise<CategoryWithItems[]> {
    try {
      const [categories, menuItems] = await Promise.all([
        this.fetchCategories(),
        this.fetchMenuItems(),
      ]);

      // Combine categories with their items
      return categories
        .sort((a, b) => a.order - b.order)
        .map((category) => ({
          ...category,
          items: menuItems
            .filter((item) => item.category.id === category.id)
            .sort((a, b) => a.category.order - b.category.order),
        }));
    } catch (error) {
      console.error("Failed to fetch menu data:", error);
      throw error;
    }
  }

  static async fetchUserDetails(headers?: {
    deviceId: string;
    tid: string;
  }): Promise<{
    customerDetails: CustomerDetails;
    hasAddress: boolean;
  }> {
    try {
      const customerDetails = await fetchFromApi<{
        customerDetails: CustomerDetails;
        hasAddress: boolean;
      }>(`/user-details/details`, false, undefined, headers);
      return customerDetails;
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
      throw error;
    }
  }

  static async fetchRestroInfo(): Promise<Info> {
    try {
      const info = await fetchFromApi<Info>("/info", false);
      return info;
    } catch (error) {
      console.error("Failed to fetch restro info:", error);
      throw error;
    }
  }
  static async fetchCutomerDeliveryDetails(headers?: {
    deviceId: string;
    tid: string;
  }): Promise<DeliveryDetails> {
    try {
      const deliveryInfo = await fetchFromApi<DeliveryDetails>(
        "/user-details/delivery",
        false,
        undefined,
        headers
      );
      return deliveryInfo;
    } catch (error) {
      console.error("Failed to fetch restro info:", error);
      throw error;
    }
  }

  static async fetchBasketDetails(basketId: string): Promise<GetCartData> {
    try {
      const cartRaw = await fetchFromApi<GetCartData>(
        `/cart/basket/${basketId}`,
        false
      );
      if (Object.keys(cartRaw).length) {
        return {
          cartItems: [...cartRaw?.cartItems],
          basketId: cartRaw.basketId,
          deviceId: cartRaw.deviceId,
          tid: cartRaw.tid,
        };
      } else {
        return { cartItems: [], basketId: "", deviceId: "", tid: "" };
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
      return { cartItems: [], basketId: "", deviceId: "", tid: "" };
    }
  }

  static async fetchCheckoutUserDetails(headers: {
    deviceId: string;
    tid: string;
  }): Promise<Customer> {
    try {
      const [customerDetails, deliveryDetails] = await Promise.all([
        this.fetchUserDetails(headers),
        this.fetchCutomerDeliveryDetails(headers),
      ]);
      const response: Customer = {
        ...customerDetails.customerDetails,
        ...deliveryDetails,
      };
      return response;
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
      throw error;
    }
  }
}
