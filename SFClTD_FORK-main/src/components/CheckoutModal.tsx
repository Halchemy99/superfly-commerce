import React, { useState } from 'react';
import { X, CreditCard, ArrowRight, Loader2 } from 'lucide-react';
// Import the singleton stripePromise from your lib
import { stripePromise, CartItem } from '../lib/stripe';
import { 
  createCoinbaseCheckout, 
  createWeChatPayment, 
  createAlipayPayment, 
  createPayPalPayment, 
  createPaytmPayment, 
  createGooglePayPayment 
} from '../lib/paymentGateways';
import { useLanguage } from '../lib/languageContext';
import { useCurrency } from '../lib/currencyContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  sustainabilityLevel: {
    name: string;
    discount: number;
  };
  totalAmount: number;
  totalSavings: number;
  onClearCart?: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  sustainabilityLevel,
  totalAmount,
  totalSavings,
  onClearCart
}) => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    company: ''
  });
  const [error, setError] = useState<string>('');

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    try {
      localStorage.setItem('superflyCart', JSON.stringify(updatedCart));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error updating cart:', error);
    }
    
    // Force reload to update UI
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Card Payment',
      description: 'Visa, Mastercard, etc.',
      icon: CreditCard,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      description: 'BTC, ETH, USDC, etc.',
      icon: () => <span className="text-2xl font-bold">₿</span>,
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-white'
    },
    {
      id: 'wechat',
      name: 'WeChat Pay',
      description: '微信支付',
      icon: () => <span className="text-2xl font-bold">微</span>,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white'
    },
    {
      id: 'alipay',
      name: 'Alipay',
      description: '支付宝',
      icon: () => <span className="text-2xl font-bold">支</span>,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Global payments',
      icon: () => <span className="text-2xl font-bold">P</span>,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white'
    },
    {
      id: 'paytm',
      name: 'Paytm',
      description: 'UPI & Wallet',
      icon: () => <span className="text-2xl font-bold">₹</span>,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      textColor: 'text-white'
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      description: 'Quick & secure',
      icon: () => <span className="text-2xl font-bold">G</span>,
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-white'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setError('');
  };

  // --- STRIPE CHECKOUT LOGIC ---
  const handleFinalCheckout = async () => {
    const stripe = await stripePromise;
    if (!stripe) throw new Error("Stripe failed to load. Check VITE_STRIPE_PUBLISHABLE_KEY.");

    // Use environment variable for backend URL
    const API_URL = import.meta.env.VITE_API_URL || '';

    const response = await fetch(`${API_URL}/api/create-custom-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: cartItems,
        customerInfo: customerInfo,
        sustainabilityLevel: sustainabilityLevel,
        totalSavings: totalSavings,
      }),
    });

    const session = await response.json();

    // Check if session ID exists before redirecting
    if (!response.ok || !session || !session.sessionId) {
      console.error("Server Error:", session);
      throw new Error(session.error || "Payment initialization failed.");
    }

    const result = await stripe.redirectToCheckout({
      sessionId: session.sessionId,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  };

  // --- MAIN HANDLE CHECKOUT ---
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    if (!customerInfo.name || !customerInfo.email) {
      setError('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    setError('');

    const checkoutData = {
      items: cartItems,
      customerInfo,
      sustainabilityLevel,
      totalAmount
    };

    try {
      switch (selectedPaymentMethod) {
        case 'stripe':
          await handleFinalCheckout();
          break;
        case 'crypto':
          await createCoinbaseCheckout(checkoutData);
          break;
        case 'wechat':
          await createWeChatPayment(checkoutData);
          break;
        case 'alipay':
          await createAlipayPayment(checkoutData);
          break;
        case 'paypal':
          await createPayPalPayment(checkoutData);
          break;
        case 'paytm':
          await createPaytmPayment(checkoutData);
          break;
        case 'googlepay':
          await createGooglePayPayment(checkoutData);
          break;
        default:
          throw new Error('Invalid payment method selected');
      }
    } catch (err: any) {
      console.error("Checkout Error:", err);
      setError(err.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-600">Complete your order in just a few steps</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left Side - Forms */}
          <div className="flex-1 p-8 overflow-y-auto max-h-[60vh] md:max-h-[85vh]">
            <form onSubmit={handleCheckout} className="space-y-8">
              {/* Customer Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={customerInfo.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm"
                      placeholder="Your company name"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                  Payment Method
                </h2>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-3 border rounded-md cursor-pointer transition-all duration-200 hover:border-orange-300 hover:bg-orange-50 ${
                        selectedPaymentMethod === method.id
                          ? 'border-orange-500 bg-orange-50 shadow-sm'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={() => handlePaymentMethodSelect(method.id)}
                        className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <div className="ml-3 flex items-center flex-1">
                        <div className={`w-8 h-8 ${method.color} rounded-md flex items-center justify-center mr-3 text-white`}>
                          {typeof method.icon === 'function' ? method.icon() : React.createElement(method.icon, { className: "w-4 h-4" })}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {method.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {method.description}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Complete Order Button */}
              <button
                type="submit"
                disabled={isProcessing || !selectedPaymentMethod}
                className="w-full flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete your order
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Side - Order Summary */}
          <div className="hidden md:block w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              {onClearCart && (
                <button
                  onClick={onClearCart}
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start py-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex-1 pr-4">
                    <div className="font-medium text-gray-900 text-sm leading-tight mb-1">{item.name}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-600">Qty:</span>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                        >
                          <span className="text-sm font-bold">-</span>
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={item.quantity}
                          onChange={(e) => updateCartItemQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-12 h-6 text-center text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                        >
                          <span className="text-sm font-bold">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="font-medium text-gray-900 text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 pt-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Items:</span>
                <span className="font-medium text-gray-900">{formatPrice(totalAmount + totalSavings)}</span>
              </div>
              
              {totalSavings > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Sustainability discount:</span>
                  <span className="font-medium text-green-600">-{formatPrice(totalSavings)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-lg font-bold border-t border-gray-300 pt-3">
                <span className="text-red-700">Order total:</span>
                <span className="text-red-700">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
