// Direct Coinbase Commerce API implementation (no SDK required)
// This avoids compatibility issues with Vite and the @coinbase/coinbase-commerce-js package

export interface CoinbaseCheckoutData {
  name: string;
  description: string;
  pricing_type: 'fixed_price';
  local_price: {
    amount: string;
    currency: string;
  };
  metadata: {
    customer_name: string;
    customer_email: string;
    order_id: string;
    sustainability_level?: string;
  };
  redirect_url: string;
  cancel_url: string;
}

export const createCoinbaseCheckout = async (checkoutData: any) => {
  try {
    // Calculate total amount
    const totalAmount = checkoutData.items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );

    // Create charge data
    const chargeData: CoinbaseCheckoutData = {
      name: `Superfly Commerce - ${checkoutData.items.length} Services`,
      description: checkoutData.items.map((item: any) => 
        `${item.name} (${item.quantity}x)`
      ).join(', '),
      pricing_type: 'fixed_price',
      local_price: {
        amount: totalAmount.toFixed(2),
        currency: 'GBP'
      },
      metadata: {
        customer_name: checkoutData.customerInfo.name,
        customer_email: checkoutData.customerInfo.email,
        order_id: `order_${Date.now()}`,
        sustainability_level: checkoutData.sustainabilityLevel.name
      },
      redirect_url: `${window.location.origin}/success?payment_method=crypto`,
      cancel_url: `${window.location.origin}/checkout`
    };

    // For demo purposes, simulate charge creation
    // In production, this would call your backend API which uses the Coinbase Commerce API
    const mockChargeId = 'charge_' + Math.random().toString(36).substr(2, 9);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, redirect to success page
    // In production, this would redirect to Coinbase Commerce checkout
    window.location.href = `/success?charge_id=${mockChargeId}&payment_method=crypto`;
    
    return { chargeId: mockChargeId };
  } catch (error) {
    console.error('Coinbase checkout error:', error);
    throw error;
  }
};

// Backend API example for creating charges using direct API calls
/*
// Replace the SDK with direct API calls in your backend
app.post('/api/coinbase/create-charge', async (req, res) => {
  try {
    const { items, customerInfo, sustainabilityLevel, totalAmount } = req.body;
    
    const chargeData = {
      name: `Superfly Commerce - ${items.length} Services`,
      description: items.map(item => `${item.name} (${item.quantity}x)`).join(', '),
      pricing_type: 'fixed_price',
      local_price: {
        amount: totalAmount.toFixed(2),
        currency: 'GBP'
      },
      metadata: {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        order_id: `order_${Date.now()}`,
        sustainability_level: sustainabilityLevel.name,
        items: JSON.stringify(items)
      },
      redirect_url: `${process.env.FRONTEND_URL}/success?payment_method=crypto`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`
    };

    // Direct API call instead of using SDK
    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY,
        'X-CC-Version': '2018-03-22'
      },
      body: JSON.stringify(chargeData)
    });

    if (!response.ok) {
      throw new Error(`Coinbase API error: ${response.statusText}`);
    }

    const charge = await response.json();
    
    res.json({ 
      chargeId: charge.data.id,
      hostedUrl: charge.data.hosted_url 
    });
  } catch (error) {
    console.error('Coinbase charge creation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Webhook handler for Coinbase Commerce
app.post('/api/coinbase/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-cc-webhook-signature'];
  const payload = req.body;
  
  try {
    // Verify webhook signature manually
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.COINBASE_COMMERCE_WEBHOOK_SECRET)
      .update(payload, 'utf8')
      .digest('hex');
    
    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    const event = JSON.parse(payload);

    switch (event.type) {
      case 'charge:confirmed':
        // Payment confirmed
        handleCryptoPaymentSuccess(event.data);
        break;
      case 'charge:failed':
        // Payment failed
        handleCryptoPaymentFailure(event.data);
        break;
      case 'charge:delayed':
        // Payment delayed (common with crypto)
        handleCryptoPaymentDelayed(event.data);
        break;
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Coinbase webhook error:', error);
    res.status(400).send('Invalid signature');
  }
});
*/

export const supportedCryptocurrencies = [
  'BTC', 'ETH', 'LTC', 'BCH', 'USDC', 'DAI'
];

// WeChat Pay integration (placeholder for backend implementation)
export const createWeChatPayment = async (checkoutData: any) => {
  try {
    // In production, this would integrate with WeChat Pay API
    // WeChat Pay requires backend integration with their merchant API
    const mockPaymentId = 'wechat_' + Math.random().toString(36).substr(2, 9);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to success page
    window.location.href = `/success?payment_id=${mockPaymentId}&payment_method=wechat`;
    
    return { paymentId: mockPaymentId };
  } catch (error) {
    console.error('WeChat Pay error:', error);
    throw error;
  }
};

// Alipay integration (placeholder for backend implementation)
export const createAlipayPayment = async (checkoutData: any) => {
  try {
    // In production, this would integrate with Alipay API
    // Alipay requires backend integration with their merchant API
    const mockPaymentId = 'alipay_' + Math.random().toString(36).substr(2, 9);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to success page
    window.location.href = `/success?payment_id=${mockPaymentId}&payment_method=alipay`;
    
    return { paymentId: mockPaymentId };
  } catch (error) {
    console.error('Alipay error:', error);
    throw error;
  }
};

// PayPal integration (placeholder for backend implementation)
export const createPayPalPayment = async (checkoutData: any) => {
  try {
    // In production, this would integrate with PayPal API
    // PayPal requires backend integration with their merchant API
    const mockPaymentId = 'paypal_' + Math.random().toString(36).substr(2, 9);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to success page
    window.location.href = `/success?payment_id=${mockPaymentId}&payment_method=paypal`;
    
    return { paymentId: mockPaymentId };
  } catch (error) {
    console.error('PayPal error:', error);
    throw error;
  }
};

// Paytm integration (placeholder for backend implementation)
export const createPaytmPayment = async (checkoutData: any) => {
  try {
    // In production, this would integrate with Paytm API
    // Paytm requires backend integration with their merchant API
    const mockPaymentId = 'paytm_' + Math.random().toString(36).substr(2, 9);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to success page
    window.location.href = `/success?payment_id=${mockPaymentId}&payment_method=paytm`;
    
    return { paymentId: mockPaymentId };
  } catch (error) {
    console.error('Paytm error:', error);
    throw error;
  }
};

// Google Pay integration (placeholder for backend implementation)
export const createGooglePayPayment = async (checkoutData: any) => {
  try {
    // In production, this would integrate with Google Pay API
    // Google Pay requires backend integration with their merchant API
    const mockPaymentId = 'googlepay_' + Math.random().toString(36).substr(2, 9);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to success page
    window.location.href = `/success?payment_id=${mockPaymentId}&payment_method=googlepay`;
    
    return { paymentId: mockPaymentId };
  } catch (error) {
    console.error('Google Pay error:', error);
    throw error;
  }
};

/*
Backend implementation examples:

// WeChat Pay backend integration
app.post('/api/wechat/create-payment', async (req, res) => {
  try {
    const { items, customerInfo, totalAmount } = req.body;
    
    // WeChat Pay API integration
    const wechatPayment = await wechatPayAPI.createOrder({
      appid: process.env.WECHAT_APP_ID,
      mch_id: process.env.WECHAT_MERCHANT_ID,
      out_trade_no: `order_${Date.now()}`,
      body: `Superfly Commerce - ${items.length} Services`,
      total_fee: Math.round(totalAmount * 100), // Convert to cents
      spbill_create_ip: req.ip,
      notify_url: `${process.env.BACKEND_URL}/api/wechat/webhook`,
      trade_type: 'NATIVE' // QR code payment
    });
    
    res.json({ 
      qrCode: wechatPayment.code_url,
      orderId: wechatPayment.prepay_id 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Alipay backend integration
app.post('/api/alipay/create-payment', async (req, res) => {
  try {
    const { items, customerInfo, totalAmount } = req.body;
    
    // Alipay API integration
    const alipayPayment = await alipayAPI.createOrder({
      out_trade_no: `order_${Date.now()}`,
      subject: `Superfly Commerce - ${items.length} Services`,
      total_amount: totalAmount.toFixed(2),
      product_code: 'FAST_INSTANT_TRADE_PAY',
      notify_url: `${process.env.BACKEND_URL}/api/alipay/webhook`,
      return_url: `${process.env.FRONTEND_URL}/success?payment_method=alipay`
    });
    
    res.json({ 
      paymentUrl: alipayPayment.body,
      orderId: alipayPayment.out_trade_no 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PayPal backend integration
app.post('/api/paypal/create-payment', async (req, res) => {
  try {
    const { items, customerInfo, totalAmount } = req.body;
    
    // PayPal API integration
    const paypalPayment = await paypalAPI.createOrder({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'GBP',
          value: totalAmount.toFixed(2)
        },
        description: `Superfly Commerce - ${items.length} Services`,
        custom_id: `order_${Date.now()}`,
        invoice_id: `inv_${Date.now()}`
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/success?payment_method=paypal`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout`
      }
    });
    
    res.json({ 
      paymentUrl: paypalPayment.links.find(link => link.rel === 'approve').href,
      orderId: paypalPayment.id 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Paytm backend integration
app.post('/api/paytm/create-payment', async (req, res) => {
  try {
    const { items, customerInfo, totalAmount } = req.body;
    
    // Paytm API integration
    const paytmPayment = await paytmAPI.createOrder({
      MID: process.env.PAYTM_MERCHANT_ID,
      WEBSITE: process.env.PAYTM_WEBSITE,
      INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE,
      CHANNEL_ID: 'WEB',
      ORDER_ID: `order_${Date.now()}`,
      CUST_ID: customerInfo.email,
      TXN_AMOUNT: totalAmount.toFixed(2),
      CALLBACK_URL: `${process.env.BACKEND_URL}/api/paytm/webhook`
    });
    
    res.json({ 
      paymentUrl: paytmPayment.body,
      orderId: paytmPayment.ORDER_ID 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
*/