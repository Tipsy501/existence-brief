import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID, PREMIUM_PRICE, CURRENCY } from '../lib/paypal';

interface PayPalButtonProps {
  onSuccess: (orderId: string) => void;
  onError: (err: any) => void;
}

export default function PayPalButton({ onSuccess, onError }: PayPalButtonProps) {
  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: CURRENCY }}>
      <PayPalButtons
        style={{ layout: "vertical", shape: "pill", color: "blue", label: "pay" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: CURRENCY,
                  value: PREMIUM_PRICE,
                },
                description: "Existence Brief Premium - Lifetime Access",
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            const details = await actions.order.capture();
            onSuccess(details.id || '');
          }
        }}
        onError={(err) => {
          console.log("PayPal Error deviation:", err);
          onError(err);
        }}
      />
    </PayPalScriptProvider>
  );
}
