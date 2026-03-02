import sgMail from '@sendgrid/mail';

// Set the API key from your environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Define interfaces for the data we'll need
interface CustomerDetails {
  email: string;
  name: string;
}

interface LineItem {
  description: string;
  amount_total: number;
  quantity: number;
}

/**
 * Sends a receipt email to the customer after a successful purchase.
 */
export const sendReceiptEmail = async (customer: CustomerDetails, lineItems: LineItem[], total: number, currency: string) => {
  // Ensure required environment variables are set
  if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL) {
    console.error('SendGrid API Key or From Email is not configured. Skipping email.');
    return;
  }

  const currencyFormatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase(),
  });

  // Create an HTML list of the purchased items
  const itemsHtml = lineItems.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.description} (x${item.quantity})</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${currencyFormatter.format(item.amount_total / 100)}</td>
    </tr>
  `).join('');

  // Construct the email message
  const msg = {
    to: customer.email,
    from: process.env.FROM_EMAIL, // This must be a verified sender in SendGrid
    subject: `Your Superfly Commerce Receipt`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">Thank you for your order, ${customer.name}!</h2>
        <p>Here is a summary of your recent purchase from Superfly Commerce:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Item</th>
              <th style="text-align: right; padding: 8px; border-bottom: 2px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="font-weight: bold; padding-top: 15px; padding-right: 8px; text-align: right;">Total</td>
              <td style="font-weight: bold; text-align: right; padding-top: 15px; padding-left: 8px;">${currencyFormatter.format(total / 100)}</td>
            </tr>
          </tfoot>
        </table>
        <p>If you have any questions about your order, please reply to this email.</p>
        <p>Thanks,<br/>The Superfly Commerce Collective</p>
      </div>
    `,
  };

  // Send the email
  try {
    await sgMail.send(msg);
    console.log(`✅ Receipt email successfully sent to ${customer.email}`);
  } catch (error) {
    console.error('❌ Error sending email with SendGrid:', error);
  }
};
