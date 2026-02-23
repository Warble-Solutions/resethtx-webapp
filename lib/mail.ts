import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendOrderConfirmation = async (to: string, details: any, orderId?: string) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️ Email not sent: Credentials missing in .env');
    return;
  }
  const { eventName, date, ticketType, quantity, totalAmount, name, tableSelection } = details;

  const typeDisplay = ticketType === 'table_reservation' ? `Table Reservation: ${tableSelection || 'General'}` : ticketType;
  const htmlContent = `
    <div style="font-family: sans-serif; background: #000; color: #fff; padding: 20px; text-align: center;">
      <h1 style="color: #D4AF37; margin-bottom: 10px;">RESET ROOFTOP LOUNGE</h1>
      <p style="font-size: 18px; color: #ccc;">Your Booking is Confirmed</p>
      
      <div style="background: #111; border: 1px solid #333; padding: 20px; margin: 20px auto; border-radius: 8px; max-width: 500px; text-align: left;">
        <h2 style="margin: 0 0 10px; color: #fff; text-align: center;">${eventName}</h2>
        <p style="color: #888; margin: 0 0 20px; text-align: center;">${new Date(date).toDateString()}</p>
        <hr style="border-color: #333; margin: 20px 0;" />
        <p><strong>Guest:</strong> ${name}</p>
        <p><strong>Type:</strong> ${typeDisplay}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Total:</strong> $${totalAmount}</p>
      </div>
      ${orderId ? `<p style="font-size: 14px; color: #aaa; margin-bottom: 20px;">Your Order ID is: <strong>${orderId}</strong>.<br/>If you need to cancel, visit our website at <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cancel" style="color: #D4AF37;">/cancel</a>.</p>` : ''}
      <p style="font-size: 12px; color: #666;">Please present this email at the door. 21+ to enter.</p>
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

export const sendAdminBookingNotification = async (details: any) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return;
  }
  const { eventName, date, ticketType, quantity, totalAmount, name, email, tableSelection } = details;
  const typeDisplay = ticketType === 'table_reservation' ? `Table Reservation: ${tableSelection || 'General'}` : ticketType;

  const htmlContent = `
    <h2>New Booking Received</h2>
    <p><strong>Event:</strong> ${eventName}</p>
    <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
    <p><strong>Guest Name:</strong> ${name}</p>
    <p><strong>Guest Email:</strong> ${email}</p>
    <p><strong>Ticket Type:</strong> ${typeDisplay}</p>
    <p><strong>Quantity:</strong> ${quantity}</p>
    <p><strong>Total Amount:</strong> $${totalAmount}</p>
  `;

  try {
    await transporter.sendMail({
      from: '"Reset HTX System" <' + process.env.GMAIL_USER + '>',
      to: process.env.GMAIL_USER, // Send to admin
      subject: `🚨 New Booking: ${eventName} - ${name}`,
      html: htmlContent,
    });
    console.log(`✅ Admin booking notification sent`);
  } catch (error) {
    console.error('❌ Error sending admin notification:', error);
  }
};

export const sendCustomerCancellation = async (to: string, details: any) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return;
  }

  const htmlContent = `
    <div style="font-family: sans-serif; background: #000; color: #fff; padding: 20px; text-align: center;">
      <h1 style="color: #D4AF37; margin-bottom: 10px;">RESET ROOFTOP LOUNGE</h1>
      <p style="font-size: 18px; color: #ccc;">Booking Cancelled & Refunded</p>
      <div style="background: #111; border: 1px solid #333; padding: 20px; margin: 20px auto; border-radius: 8px; max-width: 500px; text-align: left;">
        <p>Hi ${details.name},</p>
        <p>Your booking for <strong>${details.eventName}</strong> has been successfully cancelled.</p>
        <p>A refund has been initiated to your original payment method. Please allow 5-10 business days for the funds to appear.</p>
      </div>
      <p style="font-size: 12px; color: #666;">If you have any questions, please reply to this email.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"Reset HTX" <' + process.env.GMAIL_USER + '>',
      to,
      subject: `Booking Cancelled: ${details.eventName}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error('❌ Error sending cancellation email:', error);
  }
};

export const sendAdminCancellation = async (details: any) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return;
  }

  const htmlContent = `
    <h2>Booking Cancelled</h2>
    <p>A booking has been cancelled and refunded by the customer.</p>
    <p><strong>Event:</strong> ${details.eventName}</p>
    <p><strong>Guest Name:</strong> ${details.name}</p>
    <p><strong>Guest Email:</strong> ${details.email}</p>
    <p><strong>Order ID:</strong> ${details.orderId}</p>
  `;

  try {
    await transporter.sendMail({
      from: '"Reset HTX System" <' + process.env.GMAIL_USER + '>',
      to: process.env.GMAIL_USER,
      subject: `⚠️ Booking Cancelled: ${details.eventName} - ${details.name}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error('❌ Error sending admin cancellation notification:', error);
  }
};
