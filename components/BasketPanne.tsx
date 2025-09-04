import React, { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ChevronUp,
  Clock,
} from "lucide-react";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InfoIcon from "@mui/icons-material/Info";
import { IconButton } from "@mui/material";
import { formatPrice } from "@/utils/valuesInEuro";
import ServiceFeeDialog from "@/components/ServiceFeeDialog";
import DeliveryFeeDialog from "@/components/DeliveryFeeDialog";
import BasketDrawer from "@/components/BasketDrawer";
import CartCustomizeDrawer from "./CartCustomizeDrawer";
import { MenuItem } from "@/lib/types/menu";
import { BasketItem } from "@/lib/types/basket";
import { UpdateCustomization } from "@/hooks/useCartActions";
import { GetCartData } from "@/lib/types/cart_data.type";
import { handleBasketState } from "@/store/slices/basketSlice";
import { useDispatch } from 'react-redux';
import { CustomerDetails, DeliveryDetails } from "@/lib/types/user_details";

interface BasketPanelProps {
  customerDetails: CustomerDetails;
  deliveryDetails: DeliveryDetails;
  basketItems: BasketItem[];
  isDelivery: boolean;
  onToggleDelivery: () => void;
  addToBasket: (item: MenuItem) => void;
  removeFromBasket: (item: MenuItem) => void;
  deleteTheItem: (item: MenuItem) => void;
  onCheckout: () => void;
  getMenuItem: (itemId: string) => MenuItem;
  isUpdating?: boolean; // Add this prop for loading state
  basketId: string; // <-- Add basketId prop
  updateItemCustomization: (
    itemId: string,
    customization: UpdateCustomization
  ) => Promise<GetCartData>;
  isRestaurantOpen?: boolean;
}

// Basket Content Component - Reusable for both desktop and mobile
const BasketContent: React.FC<BasketPanelProps> = ({

  deliveryDetails,
  basketItems: initialBasketItems,
  isDelivery,
  onToggleDelivery,
  addToBasket,
  removeFromBasket,
  deleteTheItem,
  onCheckout,
  getMenuItem,
  isUpdating = false,
  basketId,
  updateItemCustomization,
  isRestaurantOpen = true,
}) => {
  const subtotal = initialBasketItems.reduce(
    (sum, item) => sum + item.price,
    0
  );
  const deliveryFee = isDelivery
    ? Number(deliveryDetails?.deliveryFee ?? 0)
    : 0;
  const serviceFeeCharge = (Number(subtotal) * 2.5) / 100;
  const serviceCharge =
    serviceFeeCharge < 0.99 ? Number(serviceFeeCharge.toFixed(2)) : 0.99;
  const total = subtotal + deliveryFee + serviceCharge;

  // Dialog state management
  const [deliveryFeeDialogOpen, setDeliveryFeeDialogOpen] = useState(false);
  const [serviceFeeDialogOpen, setServiceFeeDialogOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [customizeItem, setCustomizeItem] = useState<BasketItem | null>(null);
  const [basketItems, setBasketItems] = useState(initialBasketItems);
  const [spicyFoodItem, setSpicyFoodItem] = useState<string[]>([]);

  useEffect(() => {
    setBasketItems(initialBasketItems);
  }, [initialBasketItems]);

  useEffect(() => {
    const spicyIds = basketItems
      .map((ci) => getMenuItem(ci.itemId))
      .filter((item) => item.spicy)
      .map((item) => item.id);

    setSpicyFoodItem(spicyIds);
  }, [basketItems, getMenuItem]);

  // Dialog handlers
  const handleDeliveryFeeDialogOpen = () => setDeliveryFeeDialogOpen(true);
  const handleServiceFeeDialogOpen = () => setServiceFeeDialogOpen(true);

  const handleOpenCustomize = (item: BasketItem) => {
    setCustomizeItem(item);
    setCustomizeOpen(true);
  };
  const handleCloseCustomize = () => {
    setCustomizeOpen(false);
    setCustomizeItem(null);
  };

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Your Order</h2>
        </div>

        {/* Delivery/Collection Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onToggleDelivery()}
            disabled={isUpdating}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              !isDelivery
                ? "bg-white  text-[#f97316] shadow-md"
                : "text-gray-900 hover:text-gray-900"
            } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <StorefrontIcon fontSize="small" />
            Collection
          </button>
          <button
            onClick={() => onToggleDelivery()}
            disabled={isUpdating}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              isDelivery
                ? "bg-white text-[#f97316] shadow-md"
                : "text-gray-900 hover:text-gray-900"
            } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <DeliveryDiningIcon fontSize="small" />
            Delivery
          </button>
        </div>
      </div>

      {/* Basket Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {basketItems.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Your basket is empty</p>
            <p className="text-sm">Add some delicious items!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {basketItems.map((ci) => {
              const item = getMenuItem(ci.itemId);
              return (
                <div key={ci.itemId} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => deleteTheItem(item)}
                      disabled={isUpdating}
                      className={`text-gray-400 hover:text-red-500 transition-colors duration-200 ${
                        isUpdating ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromBasket(item)}
                        disabled={isUpdating}
                        className={`w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 ${
                          isUpdating ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-medium text-sm w-6 text-center">
                        {ci.quantity}
                      </span>
                      <button
                        onClick={() => addToBasket(item)}
                        disabled={isUpdating || !isRestaurantOpen}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200 ${
                          isUpdating || !isRestaurantOpen
                            ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
                            : "bg-orange-500 text-white hover:bg-orange-600"
                        }`}
                        title={
                          !isRestaurantOpen
                            ? "Restaurant is closed"
                            : "Add item"
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-semibold text-sm">
                      {formatPrice(ci.price)}
                    </span>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      className="text-xs text-blue-600 hover:underline font-medium"
                      onClick={() => handleOpenCustomize(ci)}
                      disabled={isUpdating}
                    >
                      Customize
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Summary */}
      {basketItems.length > 0 && (
        <>
          <div className="border-t border-gray-200 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            {isDelivery && (
              <div className="flex justify-between text-sm items-center">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Delivery fee</span>
                  <IconButton
                    onClick={handleDeliveryFeeDialogOpen}
                    size="small"
                    sx={{ padding: "2px", width: 16, height: 16 }}
                  >
                    <InfoIcon sx={{ fontSize: 12 }} />
                  </IconButton>
                </div>
                <span>€{deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm items-center">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">
                  Service fee 2.5% (max 0.99 €)
                </span>
                <IconButton
                  onClick={handleServiceFeeDialogOpen}
                  size="small"
                  sx={{ padding: "2px", width: 16, height: 16 }}
                >
                  <InfoIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </div>
              <span>€{serviceCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="p-4 border-t border-gray-200">
            {!isRestaurantOpen && (
              <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center text-orange-800 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    Restaurant is currently closed. Orders will be processed
                    when we reopen.
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={onCheckout}
              disabled={
                Boolean(subtotal && subtotal < 10) ||
                !basketId ||
                !isRestaurantOpen
              }
              aria-disabled={
                Boolean(subtotal && subtotal < 10) ||
                !basketId ||
                !isRestaurantOpen
              }
              title={
                !isRestaurantOpen
                  ? "Restaurant is closed"
                  : subtotal && subtotal < 10
                  ? "Minimum order is 10€"
                  : formatPrice(total)
              }
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200
    ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}
    ${
      !isRestaurantOpen
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
    }
  `}
            >
              {!isRestaurantOpen
                ? "Restaurant Closed"
                : !basketId && basketItems.length > 0
                ? "Preparing checkout..."
                : subtotal && subtotal < 10
                ? "Minimum order is 10 €"
                : `Checkout ${formatPrice(Number(total))}`}
            </button>
          </div>
        </>
      )}

      {/* Dialog Components */}
      <DeliveryFeeDialog
        open={deliveryFeeDialogOpen}
        onClose={() => setDeliveryFeeDialogOpen(false)}
      />
      <ServiceFeeDialog
        open={serviceFeeDialogOpen}
        onClose={() => setServiceFeeDialogOpen(false)}
      />
      <CartCustomizeDrawer
        open={customizeOpen}
        item={customizeItem}
        spicyFoodItem={spicyFoodItem}
        onClose={handleCloseCustomize}
        onSaveCustomization={updateItemCustomization}
      />
    </>
  );
};

export const BasketPanel: React.FC<BasketPanelProps> = (props) => {
  const dispatch = useDispatch();

  const handleMobileBasketOpen = () => {
    dispatch(handleBasketState(true));
  };

  const { basketItems } = props;
  const subtotal = basketItems.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = props.isDelivery ? 2.5 : 0;
  const serviceCharge = subtotal * 0.05;
  const total = subtotal + deliveryFee + serviceCharge;

  return (
    <>
      {/* Desktop Basket Panel - Fixed Right Side */}
      <aside className="hidden lg:flex fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-1200 flex-col">
        <BasketContent {...props} />
      </aside>

      {/* Mobile Basket Summary - Sticky Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
        {basketItems.length > 0 ? (
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
              onClick={handleMobileBasketOpen}
            >
              <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                {basketItems.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-semibold text-lg">€{total.toFixed(2)}</p>
              </div>
              <ChevronUp className="h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={props.onCheckout}
              disabled={
                Boolean(subtotal && subtotal < 10) ||
                !props.basketId ||
                !props.isRestaurantOpen
              }
              aria-disabled={
                Boolean(subtotal && subtotal < 10) ||
                !props.basketId ||
                !props.isRestaurantOpen
              }
              title={
                !props.isRestaurantOpen
                  ? "Restaurant is closed"
                  : subtotal && subtotal < 10
                  ? "Minimum order is 10€"
                  : formatPrice(total)
              }
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200
    ${props.isUpdating ? "opacity-50 cursor-not-allowed" : ""}
    ${
      !props.isRestaurantOpen
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
    }
  `}
            >
              {!props.isRestaurantOpen
                ? "Closed"
                : !props.basketId && basketItems.length > 0
                ? "Preparing checkout..."
                : subtotal && subtotal < 10
                ? "Minimum order is 10 €"
                : `Checkout ${formatPrice(Number(total))}`}
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <ShoppingBag className="h-6 w-6 mx-auto mb-1 text-gray-300" />
            <p className="text-sm">Your basket is empty</p>
          </div>
        )}
      </div>

      {/* Mobile Basket Drawer */}
      <BasketDrawer>
        <div className="h-full flex flex-col">
          <BasketContent {...props} />
        </div>
      </BasketDrawer>
    </>
  );
};
