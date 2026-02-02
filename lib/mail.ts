import nodemailer from 'nodemailer';

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // Will be loaded from .env later
        pass: process.env.GMAIL_APP_PASSWORD, // Will be loaded from .env later
    },
});

export const sendOrderConfirmation = async (to: string, details: any) => {
    // Safety check: Don't crash if keys are missing (dev mode)
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('⚠️ Email not sent: GMAIL_USER or GMAIL_APP_PASSWORD missing in .env');
        return;
    }

    const { eventName, date, ticketType, quantity, totalAmount, name } = details;

    const htmlContent = `
    <div style="font-family: sans-serif; background: #000; color: #fff; padding: 20px; text-align: center;">
      <h1 style="color: #D4AF37; margin-bottom: 10px;">RESET</h1>
      <p style="font-size: 18px; color: #ccc;">Your Booking is Confirmed</p>
      
      <div style="background: #111; border: 1px solid #333; padding: 20px; margin: 20px auto; border-radius: 8px; max-width: 500px;">
        <h2 style="margin: 0 0 10px; color: #fff;">${eventName}</h2>
        <p style="color: #888; margin: 0 0 20px;">${new Date(date).toDateString()}</p>
        <hr style="border-color: #333; margin: 20px 0;" />
        
        <div style="text-align: left;">
          <p><strong>Guest:</strong> ${name}</p>
          <p><strong>Type:</strong> ${ticketType === 'table_reservation' ? 'Table Reservation' : 'General Admission'}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Total:</strong> $${totalAmount}</p>
        </div>
      </div>
      
      <p style="font-size: 12px; color: #666;">Please present this email at the door.</p>
    </div>
  `;

    try {
        await transporter.sendMail({
            from: '"Reset HTX" <' + process.env.GMAIL_USER + '>',
            to,
            subject: `Booking Confirmed: ${eventName}`,
            html: htmlContent,
        });
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};
