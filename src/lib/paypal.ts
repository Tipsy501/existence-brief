/**
 * PayPal Integration Configuration
 */

export const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';
export const PREMIUM_PRICE = "29.00";
export const CURRENCY = "USD";

/**
 * Returns the PayPal SDK URL if needed for manual script injection
 */
export function getPayPalButtonUrl() {
  return `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${CURRENCY}`;
}

/**
 * Fallback redirection if the SDK fails or for manual links
 */
export function redirectToPayPal() {
  // Replace YOUR_USER_ID with real one if using PayPal.Me
  window.open('https://www.paypal.com/paypalme/existencebrief/29', '_blank');
}
