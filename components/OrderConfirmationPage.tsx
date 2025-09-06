import { notFound } from "next/navigation";
import {
  Card,
  Paper,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { Calendar, MapPin, Phone, User, CreditCard } from "lucide-react";
import { ApiService } from "@/lib/services/apiServices";
import { OrderSuccessSummary } from "@/lib/types/order_summary";
import { formatPrice } from "@/utils/valuesInEuro";
import { OrderStatus } from "@/lib/types/enums";
import CheckoutBillActions from "./CheckoutBillActions";

async function getOrderDetails(orderId: string): Promise<OrderSuccessSummary> {
  try {
    // Use the API service to fetch data
    return await ApiService.fetchOrderDetails(orderId);
  } catch (error) {
    console.error("Failed to fetch cart data:", error);
    return {} as OrderSuccessSummary;
  }
}

interface OrderConfirmationPageProps {
  orderId: string;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};
import type { ChipProps } from "@mui/material";

const getStatusColor = (status: OrderStatus): ChipProps["color"] => {
  const colors: Record<OrderStatus, ChipProps["color"]> = {
    [OrderStatus.PENDING]: "warning",
    [OrderStatus.ACCEPTED]: "info",
    [OrderStatus.PREPARING]: "primary",
    [OrderStatus.READY]: "success",
    [OrderStatus.DELIVERED]: "success",
    [OrderStatus.CANCELLED]: "error",
    [OrderStatus.IN_PROGRESS]: "primary",
    [OrderStatus.COOKED]: "primary",
    [OrderStatus.READY_FOR_PICKUP]: "info",
    [OrderStatus.OUT_FOR_DELIVERY]: "info",
    [OrderStatus.FAILED]: "error",
    [OrderStatus.COMPLETED]: "success", // ✅ Added
  };
  return colors[status] ?? "default";
};

export default async function OrderConfirmationPage({
  orderId,
}: OrderConfirmationPageProps) {
  if (!orderId) return notFound();

  const order: OrderSuccessSummary = await getOrderDetails(orderId);
  if (!order) return notFound();

  const subtotal = order.orderAmount.orderTotal;
  const deliveryFee = Number(order.orderAmount.deliveryFee) ?? 0;
  const serviceCharge = order.orderAmount.serviceFee;
  const total = subtotal + deliveryFee + serviceCharge;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card
          id="checkout-bill"
          className="rounded-2xl shadow-lg overflow-hidden"
          sx={{
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <Typography variant="h4" className="font-bold text-gray-900 mb-2">
                Order Receipt
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                Thank you for your order!
              </Typography>
            </div>

            {/* Order Header */}
            <Paper className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Typography
                    variant="caption"
                    className="text-gray-600 uppercase tracking-wide font-medium"
                  >
                    Order ID
                  </Typography>
                  <Typography variant="h6" className="font-bold text-gray-900">
                    {order.displayId}
                  </Typography>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <div>
                    <Typography
                      variant="caption"
                      className="text-gray-600 uppercase tracking-wide font-medium"
                    >
                      Order Date
                    </Typography>
                    <Typography
                      variant="body2"
                      className="font-medium text-gray-900"
                    >
                      {formatDate(new Date(order.createdAt))}
                    </Typography>
                  </div>
                </div>

                <div>
                  <Typography
                    variant="caption"
                    className="text-gray-600 uppercase tracking-wide font-medium"
                  >
                    Order Type
                  </Typography>
                  <Typography
                    variant="body2"
                    className="font-medium text-gray-900 capitalize"
                  >
                    {order.orderType}
                  </Typography>
                </div>

                <div>
                  <Typography
                    variant="caption"
                    className="text-gray-600 uppercase tracking-wide font-medium"
                  >
                    Status
                  </Typography>
                  <div className="mt-1">
                    <Chip
                      label={order.status.toUpperCase()}
                      color={getStatusColor(order.status)}
                      size="small"
                      className="font-medium"
                    />
                  </div>
                </div>
              </div>
            </Paper>

            {/* Customer Information */}
            <Paper className="p-6 mb-6 rounded-xl border border-gray-200">
              <Typography
                variant="h6"
                className="font-semibold text-gray-900 mb-4 flex items-center gap-2"
              >
                <User size={20} className="text-gray-600" />
                Customer Information
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-gray-500" />
                  <div>
                    <Typography variant="caption" className="text-gray-600">
                      Name
                    </Typography>
                    <Typography
                      variant="body1"
                      className="font-medium text-gray-900"
                    >
                      {order.userName}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-500" />
                  <div>
                    <Typography variant="caption" className="text-gray-600">
                      Phone
                    </Typography>
                    <Typography
                      variant="body1"
                      className="font-medium text-gray-900"
                    >
                      {order.userPhone}
                    </Typography>
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin size={16} className="text-gray-500 mt-1" />
                    <div>
                      <Typography variant="caption" className="text-gray-600">
                        Delivery Address
                      </Typography>
                      <Typography
                        variant="body1"
                        className="font-medium text-gray-900"
                      >
                        {order.deliveryAddress}
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            </Paper>

            {/* Order Items */}
            <Paper className="p-6 mb-6 rounded-xl border border-gray-200">
              <Typography
                variant="h6"
                className="font-semibold text-gray-900 mb-4"
              >
                Order Items
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-50">
                      <TableCell className="font-semibold text-gray-900">
                        Item
                      </TableCell>
                      <TableCell
                        align="center"
                        className="font-semibold text-gray-900"
                      >
                        Qty
                      </TableCell>
                      <TableCell
                        align="right"
                        className="font-semibold text-gray-900"
                      >
                        Price
                      </TableCell>
                      <TableCell
                        align="right"
                        className="font-semibold text-gray-900"
                      >
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.orderItems.map((item, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-gray-100"
                      >
                        <TableCell>
                          <div>
                            <Typography
                              variant="body1"
                              className="font-medium text-gray-900"
                            >
                              {item.name}
                            </Typography>
                            {item.customization && (
                              <Typography
                                variant="caption"
                                className="text-gray-600 italic"
                              >
                                {item.customization.notes ||
                                  item.customization.options?.join(", ") ||
                                  ""}
                              </Typography>
                            )}
                          </div>
                        </TableCell>
                        <TableCell align="center" className="font-medium">
                          {item.quantity}
                        </TableCell>
                        <TableCell align="right" className="font-medium">
                          {formatPrice(item.price)}
                        </TableCell>
                        <TableCell align="right" className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Order Summary */}
            <Paper className="p-6 mb-6 rounded-xl border border-gray-200">
              <Typography
                variant="h6"
                className="font-semibold text-gray-900 mb-4"
              >
                Order Summary
              </Typography>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Typography variant="body1" className="text-gray-700">
                    Subtotal
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {formatPrice(subtotal)}
                  </Typography>
                </div>

                {order.orderAmount.deliveryFee &&
                  order.orderAmount.deliveryFee > 0 && (
                    <div className="flex justify-between items-center">
                      <Typography variant="body1" className="text-gray-700">
                        Delivery Fee
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {formatPrice(order.orderAmount.deliveryFee)}
                      </Typography>
                    </div>
                  )}

                {serviceCharge && serviceCharge > 0 && (
                  <div className="flex justify-between items-center">
                    <Typography variant="body1" className="text-gray-700">
                      Service Fee
                    </Typography>
                    <Typography variant="body1" className="font-medium">
                      {formatPrice(serviceCharge)}
                    </Typography>
                  </div>
                )}

                {/* {order.orderAmount.tipAmount && order.tipAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <Typography variant="body1" className="text-gray-700">Tip</Typography>
                    <Typography variant="body1" className="font-medium">{formatPrice(order.tipAmount)}</Typography>
                  </div>
                )} */}

                {order.orderAmount.discount &&
                  order.orderAmount.discount.amount > 0 && (
                    <div className="flex justify-between items-center">
                      <Typography variant="body1" className="text-green-600">
                        Discount
                      </Typography>
                      <Typography
                        variant="body1"
                        className="font-medium text-green-600"
                      >
                        -{formatPrice(order.orderAmount.discount.amount)}
                      </Typography>
                    </div>
                  )}

                <Divider className="my-3" />

                <div className="flex justify-between items-center">
                  <Typography variant="h6" className="font-bold text-gray-900">
                    Total
                  </Typography>
                  <Typography variant="h6" className="font-bold text-gray-900">
                    {formatPrice(total)}
                  </Typography>
                </div>
              </div>
            </Paper>

            {/* Payment Method */}
            <Paper className="p-6 mb-24 rounded-xl border border-gray-200">
              <Typography
                variant="h6"
                className="font-semibold text-gray-900 mb-3 flex items-center gap-2"
              >
                <CreditCard size={20} className="text-gray-600" />
                Payment Method
              </Typography>
              <Typography variant="body1" className="font-medium text-gray-900">
                {order.selectedMethod}
              </Typography>
            </Paper>
          </div>
        </Card>

        <CheckoutBillActions orderId={order.displayId} />
      </div>
    </div>
  );
}
