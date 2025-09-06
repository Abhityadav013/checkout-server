import NavBarNavigation from "@/components/NavBarNavigation"; // Try to make this a server component
import OrderConfirmationPage from "@/components/OrderConfirmationPage";
import OrderDetails from "@/components/OrderDetails";
import OrderSummary from "@/components/OrderSummary";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import { ApiService } from "@/lib/services/apiServices";
import { GetCartData } from "@/lib/types/cart_data.type";
import { MenuItem } from "@/lib/types/menu";
import { Customer } from "@/lib/types/user_details";
import { Box } from "@mui/material";
import { redirect } from "next/navigation";

async function getMenuData(): Promise<MenuItem[]> {
  try {
    // Use the API service to fetch data
    return await ApiService.fetchMenuItems();
  } catch (error) {
    console.error("Failed to fetch menu data:", error);
    // Fallback to direct import if API fails;
    return [];
  }
}

async function getCartData(basketId: string): Promise<GetCartData> {
  try {
    // Use the API service to fetch data
    return await ApiService.fetchBasketDetails(basketId);
  } catch (error) {
    console.error("Failed to fetch cart data:", error);
    return { cartItems: [], basketId: "", deviceId: "", tid: "" };
  }
}

async function getCustomerCheckoutDetails(headers: {
  deviceId: string;
  tid: string;
}): Promise<Customer> {
  try {
    // Use the API service to fetch data
    return await ApiService.fetchCheckoutUserDetails(headers);
  } catch (error) {
    console.error("Failed to fetch cart data:", error);
    return {
      name: "",
      phoneNumber: "",
      address: {
        displayAddress: "",
        buildingNumber: "",
        street: "",
        town: "",
        pincode: "",
      },
      orderType: "",
      userLocation: { lat: 0, lng: 0 },
      isFreeDelivery: false,
      deliveryFee: 0,
      deliverable: false,
    };
  }
}

type CheckoutPageParam = {
  orderId?: string;
  basketId: string;
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams?: Promise<CheckoutPageParam>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  console.log('resolvedParams:::::',resolvedParams)
  const orderId = resolvedParams?.orderId;
  const basketId = resolvedParams?.basketId ?? "";
  if (!basketId) {
    redirect("https://order.indiantadka.eu/"); // server-side redirect
  }
  const [menuData, cartdata] = await Promise.all([
    getMenuData(),
    getCartData(basketId),
  ]);

  const userData = await getCustomerCheckoutDetails({
    deviceId: cartdata.deviceId,
    tid: cartdata.tid,
  });
  console.log('orderId:::::',orderId)
  if (orderId) {
    <OrderConfirmationPage orderId={orderId} />;
  }
  return (
    <main className="min-h-screen bg-gray-50 py-4 px-2 bg-[url('https://testing.indiantadka.eu/assets/bg-checkout-multi.avif')] bg-no-repeat bg-cover bg-center">
      <NavBarNavigation label="Checkout" isImage={false} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column", // Stacked on extra-small screens (mobile)
              sm: "column", // Optional: stacked on small screens
              md: "row", // Side-by-side on medium and up (tablet/laptop)
            },
            gap: 4,
            maxWidth: "1000px",
            width: "100%",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <OrderDetails cart={cartdata} userData={userData} />
            <PaymentMethodSelector />
          </Box>

          <Box sx={{ flex: 1 }}>
            <OrderSummary cart={cartdata} menu={menuData} />
          </Box>
        </Box>
      </Box>
    </main>
  );
}
