export const subscriptionConfig = {
  priceLabel: '$25/mo',
  offerName: 'GTA Money Team Workshop Access',
  checkoutMode: 'subscription',
  // Replace with your live Stripe Payment Link or your own backend checkout endpoint.
  stripePaymentLink: 'https://buy.stripe.com/REPLACE_WITH_GTA_MONEY_TEAM_25_MONTHLY',
  // Optional: use this if you prefer a backend route that creates Checkout Sessions.
  backendCheckoutEndpoint: '/api/create-workshop-checkout-session',
  successUrlHint: '/?success=true&page=workshop',
  demoUnlockCode: 'GMT-WORKSHOP-25-DEMO',
  productionRule: 'Do not trust localStorage for real paid access. Use Stripe webhooks or Tebex entitlements to verify paid membership server-side.'
}
