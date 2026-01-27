import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_build';

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️ STRIPE_SECRET_KEY is missing from .env.local. Stripe features will not work.');
}

export const stripe = new Stripe(stripeKey, {
    apiVersion: '2025-12-15.clover', // Matched to installed package types
    typescript: true,
});
