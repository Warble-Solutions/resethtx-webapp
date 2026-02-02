import { NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/mail';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { to, details } = body;

        if (!to || !details) {
            return NextResponse.json({ error: 'Missing to or details' }, { status: 400 });
        }

        await sendOrderConfirmation(to, details);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in sending email:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
