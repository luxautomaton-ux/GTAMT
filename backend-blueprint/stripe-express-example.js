import express from 'express';
import Stripe from 'stripe';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-checkout-session', express.json(), async (req, res) => {
  const { priceId, successUrl, cancelUrl } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  res.json({ url: session.url });
});

app.listen(4242);
