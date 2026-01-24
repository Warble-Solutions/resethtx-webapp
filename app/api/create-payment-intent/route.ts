import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'mock_key', {
    apiVersion: '2025-12-15.clover', // Use latest stable version or match your account
});

export async function POST(request: Request) {
    try {
        const { amount, eventId } = await request.json();

        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({ error: 'Missing Stripe Keys' }, { status: 500 });
        }

        if (amount === 0) {
            // SKIP STRIPE ENTIRELY
            // 1. Directly insert ticket into Supabase
            // Note: In a real app, user details should come from the request body for RSVP. 
            // Here, we assume the client might pass them or we just auto-confirm if it's a simple flow. 
            // However, the checkout page (client) calls this just to get a clientSecret usually.
            // If we want to record the RSVP here, we need the user details. 
            // BUT, the implementation plan says: "Directly insert ticket into Supabase... Return success immediately".
            // Since the current checkout page doesn't seem to pass user details to this endpoint (only amount/eventId),
            // we will stick to returning isFree: true, and let the client handle the "confirm" action 
            // OR we rely on the `purchaseTickets` action we saw earlier which handles everything.
            // 
            // Wait, the user request says: "The Fix: ... if (amount === 0) { ... insert ... return success }".
            // If this endpoint is ONLY used for payment intent, it might not receive user info.
            // Let's check `CheckoutPage.tsx` usage. It sends { amount, eventId }. No user info.
            // So we CANNOT insert the ticket here effectively without user data.
            // 
            // However, the user also provided: "Task 3: Update Frontend Checkout... If response.isFree is true..."
            // So the strategy is:
            // 1. API returns { isFree: true }
            // 2. Frontend sees isFree, skips Stripe.
            // 3. Frontend probably calls `purchaseTickets` action (which we saw handled 'isFree' logic) OR
            //    we need to make sure the Frontend *actually* calls the server action to confirm.

            // The `CheckoutPage.tsx` currently only fetches the intent. It has a `CheckoutForm.tsx` (which we haven't seen fully, but likely has the form).
            // If `isFree` is returned, `CheckoutPage` needs to show a "Complete RSVP" button or similar that calls `purchaseTickets`.

            // The user instruction for THIS file was:
            // "Directly insert ticket into Supabase... const { error } = await supabase..."
            // BUT, without user data, we can't insert a valid ticket purchase record (needs name, email, etc).
            // 
            // RE-EVALUATING: 
            // The user might expect the `purchaseTickets` (Server Action) to be used for the actual insertion.
            // But they specifically asked to modify THIS route. 
            // If I look at the `purchaseTickets` action in `app/actions/checkout.ts`, it ALREADY handles free tickets!
            // 
            // So, for this API route, the goal is just to NOT crash and NOT create a stripe intent.
            // I will return `{ isFree: true }` so the frontend knows what to do.
            // I will NOT insert the ticket here because I don't have the data.

            return NextResponse.json({ clientSecret: null, isFree: true });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            metadata: { eventId },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.error('Internal Error:', error);
        return NextResponse.json(
            { error: `Internal Server Error: ${error.message}` },
            { status: 500 }
        );
    }
}
