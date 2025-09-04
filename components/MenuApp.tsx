"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SearchBar } from "./SearchBar";
import { CategoryWithItems } from "@/lib/types/categoryItems";
import { MenuItem } from "@/lib/types/menu";
import NavBarNavigation from "./NavBarNavigation";
import { CategoryList } from "./CategoryFilter";
import { MenuSection } from "./MenuSection";

import AddressForm from "./AddressForm";
import { CustomerDetails } from "@/lib/types/user_details";
import { Info } from "@/lib/types/restro_info";
import { RestaurantAvailabilityBanner } from "./RestaurantAvailabilityBanner";
import { BasketPanel } from "./BasketPanne";
import { useCartData } from "@/hooks/useCartQuery";
import { useCartActions } from "@/hooks/useCartActions";
import { useUrlParams } from "@/hooks/useUrlParams";
import { OrderType } from "@/lib/types/enums";
import SkeletonSidebar from "./Skeletons/SkeletonSidebar";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import {
  useFetchUserAddressesQuery,
  useFetchUserDeliveryQuery,
} from "@/store/api/addressApi";

interface MenuAppProps {
  initialCategories: CategoryWithItems[];
  menulist: MenuItem[];

  info: Info;
}
export const MenuApp: React.FC<MenuAppProps> = ({
  initialCategories,
  menulist,
  info,
}) => {
  const [isAddressModelOpen, setAddressModelOpen] = useState(false);
  const [isDelivery, setIsDelivery] = useState(true);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    initialCategories[0]?.id || ""
  );
  const [filteredCategories, setFilteredCategories] =
    useState<CategoryWithItems[]>(initialCategories);
  const router = useRouter();
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { data: customerDetails } = useFetchUserAddressesQuery();
  const [customerInfo, setCustomerDetails] = useState<CustomerDetails>(
    customerDetails?.customerDetails || ({} as CustomerDetails)
  );
  const isAddressModel = useSelector(
    (state: RootState) => state.address.addressModel
  );

  const { data: deliveryDetails } = useFetchUserDeliveryQuery();
  const {
    items,
    basketId,
    getMenuItem,
    isLoading: isCartLoading,
  } = useCartData({
    menuItems: menulist,
  });

  const {
    isUpdating,
    addToCart,
    removeFromCart,
    deleteItemFromCart,
    updateItemCustomization,
  } = useCartActions();

  const { getParams, updateParams, isReady: isUrlReady } = useUrlParams();
  // If your hook doesn't expose isReady, you can infer url readiness by a one-time read or fallback.

  useEffect(() => {
    setAddressModelOpen(isAddressModel);
  }, [isAddressModel]);

  // Derive orderType only after URL params are ready (prevents hydration flicker)
  const rawOrderType = useMemo(() => {
    if (!isUrlReady) return null;
    return getParams.get("orderType");
  }, [isUrlReady, getParams]);

  useEffect(() => {
    if (!isUrlReady) return; // wait until URL params are readable on client
    const current = getParams.get("orderType");
    if (!current) {
      // Set default without scrolling and replacing history entry
      updateParams(
        { orderType: OrderType.DELIVERY },
        { scroll: false, replace: true, preserve: true }
      );
    }
  }, [isUrlReady, getParams, updateParams]);
  // Initialize isDelivery once URL params are ready
  useEffect(() => {
    if (rawOrderType == null) return;
    setIsDelivery(rawOrderType === OrderType.DELIVERY);
  }, [rawOrderType]);

  // Compute “isReady” state: all dependencies satisfied
  const isReady = useMemo(() => {
    // info must exist and be well-formed
    const hasInfo = Boolean(info);
    // customerDetails.customerDetails must be present (not just hasAddress)
    const hasCustomer = Boolean(customerInfo ?? true);
    // cart finished its initial load
    const hasCart = !isCartLoading;
    // url params available so we can trust isDelivery
    const hasUrl = Boolean(isUrlReady && rawOrderType != null);

    return hasInfo && hasCustomer && hasCart && hasUrl;
  }, [info, customerInfo, isCartLoading, isUrlReady, rawOrderType]);

  // Filter categories based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(initialCategories);
      return;
    }
    const lowered = searchTerm.toLowerCase();
    const filtered = initialCategories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.name.toLowerCase().includes(lowered) ||
            item.description.toLowerCase().includes(lowered)
        ),
      }))
      .filter((category) => category.items.length > 0);

    setFilteredCategories(filtered);
  }, [searchTerm, initialCategories]);

  // Handle scroll-based category highlighting
  useEffect(() => {
    const handleScroll = () => {
      if (searchTerm) return; // Don't auto-highlight when searching

      const scrollPosition = window.scrollY + 250; // Offset for sticky headers

      let currentCategory = filteredCategories[0]?.id || "";

      filteredCategories.forEach((category) => {
        const element = sectionRefs.current[category.id];
        if (element) {
          const { offsetTop } = element;
          if (scrollPosition >= offsetTop) {
            currentCategory = category.id;
          }
        }
      });

      if (currentCategory !== activeCategory) {
        setActiveCategory(currentCategory);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredCategories, activeCategory, searchTerm]);

  const handleCategoryClick = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    const element = sectionRefs.current[categoryId];
    if (element) {
      const offsetTop = element.offsetTop - 230; // Account for sticky headers
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  }, []);

  const addToBasket = (item: MenuItem) => {
    // Note: The logic was inverted in your snippet; assuming the restaurant must be open to add
    if (!isRestaurantOpen) {
      console.log("Cannot add items when restaurant is closed");
      return;
    }
    if (
      !customerInfo ||
      (Object.keys(customerInfo).length === 0 &&  (customerDetails && !customerDetails.hasAddress))
    ) {
    }

    if (!deliveryDetails) {
      setAddressModelOpen(true);
      return;
    }
    if (!isAddressModelOpen && isDelivery && !deliveryDetails.deliverable) {
      setAddressModelOpen(false);
      router.push("/delivery-error");
      return;
    }

    try {
      addToCart(item);
      // Don't manually update basketItems here - let the hook handle it
    } catch (error) {
      // Handle cart busy error silently - this is expected behavior
      if (error === "Cart is busy" || error === "Operation debounced") {
        console.log("Cart operation in progress, please wait...");
        return;
      }
      // Log other errors for debugging
      console.error("Failed to add item to cart:", error);
    }
  };

  const removeFromBasket = useCallback(
    async (item: MenuItem) => {
      try {
        await removeFromCart(item);
      } catch (error) {
        if (error === "Cart is busy" || error === "Operation debounced") {
          console.log("Cart operation in progress, please wait...");
          return;
        }
        console.error("Failed to remove item from cart:", error);
      }
    },
    [removeFromCart]
  );

  const deleteTheItem = useCallback(
    async (item: MenuItem) => {
      try {
        await deleteItemFromCart(item.id);
      } catch (error) {
        if (error === "Cart is busy" || error === "Operation debounced") {
          console.log("Cart operation in progress, please wait...");
          return;
        }
        console.error("Failed to delete item from cart:", error);
      }
    },
    [deleteItemFromCart]
  );

  const handleBasketType = useCallback(
    (currentIsDelivery: boolean) => {
      const newIsDelivery = !currentIsDelivery;
      const newOrderType = newIsDelivery
        ? OrderType.DELIVERY
        : OrderType.PICKUP;

      setIsDelivery(newIsDelivery);

      updateParams(
        { orderType: newOrderType },
        { scroll: false, replace: true, preserve: true }
      );
    },
    [updateParams]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBarNavigation label="Our Menu" redirect_url="/" isImage={false} />

      <div className="lg:pr-80 pb-20 lg:pb-0">
        <RestaurantAvailabilityBanner
          onAvailabilityChange={setIsRestaurantOpen}
        />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <CategoryList
          categories={filteredCategories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
        <main className="max-w-4xl mx-auto px-4 py-8 mt-5">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No items found
                </h3>
                <p className="text-gray-500">
                  No items match &quot;{searchTerm}&quot;. Try searching for
                  something else.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((category) => (
                <MenuSection
                  key={category.id}
                  ref={(el) => {
                    sectionRefs.current[category.id] = el;
                  }}
                  category={category}
                  onAddToBasket={addToBasket}
                  isRestaurantOpen={isRestaurantOpen}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Right side: show SkeletonSidebar until the app is ready */}
      {isReady ? (
        <BasketPanel
          customerDetails={customerDetails?.customerDetails ?? {} as CustomerDetails}
          deliveryDetails={deliveryDetails!}
          basketItems={items}
          isDelivery={isDelivery}
          onToggleDelivery={() => handleBasketType(isDelivery)}
          getMenuItem={getMenuItem ?? ({} as MenuItem)}
          addToBasket={addToBasket}
          removeFromBasket={removeFromBasket}
          deleteTheItem={deleteTheItem}
          onCheckout={() => {
            router.push("/checkout");
          }}
          isUpdating={isUpdating}
          basketId={basketId}
          updateItemCustomization={updateItemCustomization}
          isRestaurantOpen={isRestaurantOpen}
        />
      ) : (
        // Your MUI SkeletonSidebar (it is sticky and full-height)
        <div className="hidden lg:block fixed right-0 top-0 h-full w-[320px]">
          <SkeletonSidebar />
        </div>
      )}

      <AddressForm
        customerDetails={customerDetails?.customerDetails ?? {} as CustomerDetails}
        hasAddress={isAddressModelOpen}
        isDelivery={isDelivery}
        setAddressModelOpen={setAddressModelOpen}
        setCustomerDetails={setCustomerDetails}
        handleBasketType={handleBasketType}
      />
    </div>
  );
};

export default MenuApp;
