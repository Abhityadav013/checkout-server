'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import type { PaymentMethod } from '@/lib/types/payment_method_type';
import { Button, CircularProgress } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDialogDataFromSession } from '@/utils/updateCustomerOrderDetails';
import { OrderType } from '@/lib/types/enums';

export default function PaymentMethod() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { payment_type } = useSelector((state: RootState) => state.payment);
  const searchParams = useSearchParams(); // URLSearchParams
  const basketParam = searchParams.get('basketId') || '';
  const orderTypeParam = searchParams.get('orderType') || '';
 
  useEffect(() => {
    if (payment_type) {
      setSelectedMethod(payment_type);
      setLoading(false);
    }
  }, [payment_type]);

  if (loading) return null;

  const handleCashPayment = async () => {
    setSubmitting(true);
    const isDelivery = orderTypeParam === OrderType.DELIVERY || false;
    const deliveryTimeData = getDialogDataFromSession('time');
    const deliveryNoteData = getDialogDataFromSession('notes') as { notes: string };

    const payRes = await fetch('/api/v1/create-cash-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selectedMethod: selectedMethod,
        basketId: basketParam,
        orderType: orderTypeParam,
        deliveryTime: deliveryTimeData,
        ...(isDelivery && { deliveryNote: deliveryNoteData?.notes ?? '' }),
      }),
    });

    const payData = await payRes.json();
    if (payData.orderId) {
      setSubmitting(false);
      router.push(
        `/checkout${basketParam ? '?basket=' + basketParam : ''}&orderId=${payData.orderId}`
      );
      return;
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleCashPayment}
      sx={{
        width: '100%',
        backgroundColor: '#f36805',
        color: 'white',
        padding: '6px 12px',
        fontSize: '20px',
        fontWeight: 'bold',
        borderRadius: '50px',
        textTransform: 'none',
        '&:hover': {
          backgroundColor: '#f36805',
        },
      }}
    >
      {submitting ? <CircularProgress size={34} /> : 'Place Order'}
    </Button>
  );
}
