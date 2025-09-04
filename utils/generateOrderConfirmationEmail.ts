import { IOrder } from '@/lib/types/order';
import { formatPrice } from './valueInEuros';
import { OrderType } from '@/lib/types/order_type';
import { OrderStatus } from '@/lib/types/order_status';
import { PaymentMethod } from '@/lib/types/payment_method';

export function generateOrderConfirmationEmail(order: IOrder): string {
  const {
    displayId,
    orderDate,
    orderType,
    orderItems,
    orderAmount,
    deliveryAddress,
    deliveryTime,
    deliveryNote,
    userName,
    userPhone,
    selectedMethod,
  } = order;

  // Date formatting
  const dateObj = new Date(orderDate);
  const formattedDate = dateObj.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const serviceFee = orderAmount.serviceFee ?? 0;
  const deliveryFee = Number(orderAmount.deliveryFee) ?? 0;
  const tipAmount = Number(orderAmount.tipAmount ?? 0);
  const discount = orderAmount.discount;
  const subtotal = Number(orderAmount.orderTotal);
  const total = subtotal + deliveryFee + serviceFee;

  // Items list
  const itemsHtml = orderItems
    .map(
      (item) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0;">
            <span style="font-weight: 500;">${item.itemName}</span><br/>
            <span style="color:#666; font-size: 13px;">Quantity: ${item.quantity}</span>
          </td>
          <td style="text-align: right; padding: 8px 0; white-space: nowrap;">
            ${formatPrice(Number(item.price))}
          </td>
        </tr>`
    )
    .join('');

  // Subtotal with discount
  let subtotalHtml = '';
  if (discount && discount.amount) {
    subtotalHtml = `
      <span style="text-decoration: line-through; color: gray; margin-right: 8px;">
        ${formatPrice(subtotal + discount.amount)}
      </span>
      <span style="font-weight: bold;">${formatPrice(subtotal)}</span>
    `;
  } else {
    subtotalHtml = `<span style="font-weight: bold;">${formatPrice(subtotal)}</span>`;
  }

  // Discount box
  let discountBoxHtml = '';
  if (discount && discount.amount) {
    discountBoxHtml = `
      <tr>
        <td colspan="2" style="padding: 12px 0;">
          <div style="border: 1px dashed #38a169; border-radius: 8px; background: #f0fff4; padding: 12px 16px; margin: 8px 0;">
            <div style="font-weight: bold; color: #2f855a; font-size: 15px; margin-bottom: 4px;">🎉 You saved ${formatPrice(Number(discount.amount))}!</div>
            <div style="color: #2f855a; font-size: 13px;">Coupon Applied: 
              <span style="display: inline-block; background: #38a169; color: #fff; border-radius: 12px; padding: 2px 10px; font-weight: 600; font-size: 13px;">
                ${discount.code}
              </span>
            </div>
          </div>
        </td>
      </tr>
    `;
  }

  // Delivery address (if delivery)
  let addressHtml = '';
  if (orderType === OrderType.DELIVERY && deliveryAddress) {
    addressHtml = `
      <tr>
        <td colspan="2" style="padding: 12px 0;">
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; background: #e0e7ef; border-radius: 50%; width: 24px; height: 24px; text-align: center; line-height: 24px; margin-right: 8px; font-size: 16px;">🏠</span>
            <span style="font-size: 16px; font-weight: 600;">Delivery Address</span>
          </div>
          <div style="background: #f9f9f9; padding: 10px; border-radius: 4px; font-size: 15px;">${deliveryAddress}</div>
        </td>
      </tr>
    `;
  }

  // Delivery note
  const deliveryNoteHtml = `
    <tr>
      <td colspan="2" style="padding: 4px 0 12px 0; text-align: center;">
        <span style="color: #666; font-size: 14px;">Delivery Note: <strong>${deliveryNote ?? ''}</strong></span>
      </td>
    </tr>
  `;

  // Tip row
  let tipHtml = '';
  if (tipAmount > 0) {
    tipHtml = `
      <tr>
        <td style="padding: 8px 0;">Tip:</td>
        <td style="text-align: right; padding: 8px 0;">${formatPrice(tipAmount)}</td>
      </tr>
    `;
  }

  // Delivery fee row
  let deliveryFeeHtml = '';
  if (orderAmount.deliveryFee !== undefined) {
    deliveryFeeHtml = `
      <tr>
        <td style="padding: 8px 0;">Delivery Fee:</td>
        <td style="text-align: right; padding: 8px 0;">${formatPrice(deliveryFee)}</td>
      </tr>
    `;
  }

  // Service fee row
  const serviceFeeHtml = `
    <tr>
      <td style="padding: 8px 0;">Service fee 2.5% (max 0.99 €)</td>
      <td style="text-align: right; padding: 8px 0;">${formatPrice(serviceFee)}</td>
    </tr>
  `;

  // Total row
  const totalHtml = `
    <tr>
      <td style="padding: 12px 0; font-weight: bold; font-size: 16px;">Total:</td>
      <td style="text-align: right; padding: 12px 0; font-weight: bold; font-size: 16px;">${formatPrice(total)}</td>
    </tr>
  `;

  // Payment method row
  const paymentMethodHtml = `
    <tr>
      <td colspan="2" style="padding-top: 10px; text-align: center; font-size: 14px; color: #555;">
        Payment Method: <strong>${selectedMethod}</strong>
      </td>
    </tr>
  `;

  // Main email HTML
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #e9ecee; margin: 0; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="100%" style="max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
            <tr>
              <td align="center" style="padding-bottom: 16px;">
                <h2 style="margin: 0; color: #333; font-size: 2rem;">Order Confirmation</h2>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 8px;">
                <span style="background-color: #1976d2; color: #fff; padding: 6px 14px; border-radius: 20px; font-size: 14px; letter-spacing: 1px;">
                  ${orderType}
                </span>
              </td>
            </tr>
            <tr>
              <td align="center" style="color: #555; font-size: 14px; padding-bottom: 4px;">
                Order # <strong>${displayId}</strong> • ${formattedDate} at ${formattedTime}
              </td>
            </tr>
            <tr>
              <td align="center" style="color: #555; font-size: 14px; padding-bottom: 4px;">
                Delivery Time: <strong>${!deliveryTime.asap && deliveryTime.scheduledTime}</strong>
              </td>
            </tr>
            <tr>
              <td align="center" style="color: #555; font-size: 14px; padding-bottom: 4px;">
                Customer: <strong>${userName}</strong>
              </td>
            </tr>
            <tr>
              <td align="center" style="color: #555; font-size: 14px; padding-bottom: 4px;">
                Phone: <strong>${userPhone}</strong>
              </td>
            </tr>
            ${deliveryNoteHtml}
            ${paymentMethodHtml}
            <tr><td><hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" /></td></tr>
            <tr>
              <td>
                <h3 style="margin: 20px 0 10px; font-size: 1.2rem;">Order Summary</h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
                  ${itemsHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 8px;">
                  <tr>
                    <td style="padding: 8px 0;">Cart Subtotal:</td>
                    <td style="text-align: right; padding: 8px 0;">${subtotalHtml}</td>
                  </tr>
                </table>
              </td>
            </tr>
            ${discountBoxHtml}
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 0;">
                  ${deliveryFeeHtml}
                  ${tipHtml}
                  ${serviceFeeHtml}
                  <tr><td colspan="2"><hr style="border: none; border-top: 1px solid #ccc; margin: 10px 0;" /></td></tr>
                  ${totalHtml}
                </table>
              </td>
            </tr>
            ${addressHtml}
            <tr>
              <td align="center" style="padding-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || '#'}" style="display: inline-block; padding: 10px 20px; background-color: #1976d2; color: #fff; text-decoration: none; border-radius: 4px; font-size: 16px;">Back to Home</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
