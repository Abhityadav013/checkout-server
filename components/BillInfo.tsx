'use client';
import DeliveryFeeDialog from '@/components/DeliveryFeeDialog';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import ServiceFeeDialog from '@/components/ServiceFeeDialog';
import { BasketItem } from '@/lib/types/basket';
import { formatPrice } from '@/utils/valuesInEuro';
import { useFetchUserDeliveryQuery } from '@/store/api/addressApi';
import { OrderType } from '@/lib/types/enums';
// Calculate totals
interface BillInfoProps {
  cart: BasketItem[];
}
const BillInfo = ({ cart }: BillInfoProps) => {
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
  const [serviceFeeDialogOpen, setServiceFeeDialogOpen] = useState(false); // State to control dialog visibility
  const handleDialogOpen = () => setDialogOpen(true);
  const { data: deliveryDetails } = useFetchUserDeliveryQuery();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );
  const deliveryFee = deliveryDetails?.orderType ===OrderType.DELIVERY
    ? Number(deliveryDetails?.deliveryFee ?? 0)
    : 0;
  const serviceFeeCharge = (Number(subtotal) * 2.5) / 100;
  const serviceCharge =
    serviceFeeCharge < 0.99 ? Number(serviceFeeCharge.toFixed(2)) : 0.99;
  const total = subtotal + deliveryFee + serviceCharge;

  const handleServiceFeeDialogOpen = () => setServiceFeeDialogOpen(true);
  return (
    <>
      <Box className="my-4">
        <Box className="flex justify-between mb-0.2">
          <Typography variant="body2" fontWeight="bold">
            Subtotal
          </Typography>
          <Typography variant="body2">{formatPrice(Number(subtotal))}</Typography>
        </Box>

        {deliveryDetails?.orderType ===OrderType.DELIVERY && (
          <Typography variant="body2" className="flex justify-between">
            <span>
              Delivery Fee
              <IconButton onClick={handleDialogOpen} sx={{ paddingLeft: '5px' }}>
                <InfoIcon sx={{ fontSize: 12 }} /> {/* You can adjust the font size here */}
              </IconButton>
            </span>
            {formatPrice(deliveryFee)}
          </Typography>
        )}

        <Typography variant="body2" className="flex justify-between">
          <span>
            Service fee 2.5% (max 0.99 €)
            <IconButton onClick={handleServiceFeeDialogOpen} sx={{ paddingLeft: '5px' }}>
              <InfoIcon sx={{ fontSize: 12 }} /> {/* You can adjust the font size here */}
            </IconButton>
          </span>
          {formatPrice(serviceCharge)}
        </Typography>
      </Box>

      <Divider className="mb-4" />

      <Box className="flex justify-between mb-6">
        <Typography variant="h6" className="font-bold">
          Total
        </Typography>
        <Typography variant="h6" className="font-bold">
          {formatPrice(total)}
        </Typography>
      </Box>

      <DeliveryFeeDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      <ServiceFeeDialog
        open={serviceFeeDialogOpen}
        onClose={() => setServiceFeeDialogOpen(false)}
      />
    </>
  );
};

export default BillInfo;
