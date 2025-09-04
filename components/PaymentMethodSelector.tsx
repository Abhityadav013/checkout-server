"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Typography,
  Button,
} from "@mui/material";

import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import EuroSymbolOutlinedIcon from "@mui/icons-material/EuroSymbolOutlined";
import Image from "next/image";
import { setPaymentMethod } from "@/store/slices/paymentSlice";
import { PaymentMethod } from "@/lib/types/payment_method_type";
import PaymentMethodSelectorSkeleton from "./Skeletons/PaymentMethodSelectorSkeleton";

export const paymentMethods = [
  {
    id: "cash",
    name: "Cash on Delivery",
    icon: <EuroSymbolOutlinedIcon className="text-orange-500" />,
  },
  {
    id: "google",
    name: "Google Pay",
    icon: (
      <Image
        src="https://static.takeaway.com/images/platform-payments/payment-options/GPay.png"
        alt="GPay"
        width={24}
        height={24}
      />
    ),
  },
  {
    id: "credit",
    name: "Credit or Debit card",
    icon: <CreditCardOutlinedIcon />,
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: (
      <Image
        src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
        alt="PayPal"
        width={24}
        height={24}
      />
    ),
  },
];

export default function PaymentMethodSelector() {
  const isMobile = useSelector((state: RootState) => state.mobile.isMobile);
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    (typeof paymentMethods)[0] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { payment_type } = useSelector((state: RootState) => state.payment);

  useEffect(() => {
    const stored = sessionStorage.getItem('selectedPaymentMethod');
    const method = paymentMethods.find((m) => m.id === (payment_type ?? stored));
    if (method) {
      setSelectedMethod(method);
      dispatch(setPaymentMethod(method.id as PaymentMethod));
    } else {
      setSelectedMethod(paymentMethods[0]);
      dispatch(setPaymentMethod(paymentMethods[0].id as PaymentMethod));
    }
    setLoading(false);
  }, [dispatch,payment_type]); // remove all dependencies to run only once
  const handleSelect = () => {
    if (selectedMethod) {
      sessionStorage.setItem("selectedPaymentMethod", selectedMethod.id);
      dispatch(setPaymentMethod(selectedMethod.id as PaymentMethod));
      setTimeout(() => setOpen(false), 200);
    }
  };

  return (
    <>
      {loading ? (
        <PaymentMethodSelectorSkeleton />
      ) : (
        <div className="max-w-md mx-auto p-6 my-4 bg-white rounded-xl shadow cursor-default select-none">
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Payment options
          </Typography>

          <div
            className="flex items-center justify-between p-4 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <div className="flex items-center gap-2">
              <span>{selectedMethod?.icon}</span>
              <span className="text-lg font-medium">
                {selectedMethod?.name}
              </span>
            </div>
            <ArrowForwardIosOutlinedIcon className="text-gray-400" />
          </div>
        </div>
      )}

      {/* Payment method selection dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={isMobile}
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 0,
          }}
        >
          <div className="flex items-center gap-2">
            <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 24 }} />
            Select Payment Method
          </div>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <List>
            {paymentMethods.map((method) => (
              <ListItem key={method.id} disablePadding>
                <ListItemButton
                  onClick={() => setSelectedMethod(method)}
                  sx={{
                    py: 2, // increased vertical padding
                    px: 3,
                    fontSize: "1.1rem", // slightly larger text
                  }}
                  selected={selectedMethod?.id === method.id}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {method.icon}
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "1.1rem",
                      fontWeight: 500,
                    }}
                    primary={method.name}
                  />
                  {selectedMethod?.id === method.id && (
                    <CheckCircleIcon sx={{ color: "green" }} />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />

          <div className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                borderRadius: 3,
                backgroundColor: "#f36805",
                color: "white",
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1.2rem",
              }}
              onClick={handleSelect}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
