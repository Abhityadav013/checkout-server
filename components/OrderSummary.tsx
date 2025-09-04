import { Paper, Typography, Box } from "@mui/material";
import { LocalDining } from "@mui/icons-material";
import { BasketItem } from "@/lib/types/basket";
import { MenuItem } from "@/lib/types/menu";
import CheckoutCart from "./CheckoutCart";
import PaymentMethod from "./PaymentMethod";

interface OrderSummaryProps {
  cart: { cartItems: BasketItem[]; basketId: string };
  menu: MenuItem[];
}

export default function OrderSummary({ cart, menu }: OrderSummaryProps) {
  if (cart.cartItems.length == 0) {
    return null;
  }
  return (
    <Paper className="bg-white rounded-lg lg:mt-10 shadow p-4 max-w-md mx-auto">
      <Box className="flex items-center">
        <LocalDining className="mr-2 text-orange-500" />
        <Typography variant="h6" className="font-bold">
          Order summary
        </Typography>
      </Box>
      <CheckoutCart cart={cart.cartItems} menu={menu} />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <PaymentMethod />
      </Box>
    </Paper>
  );
}
