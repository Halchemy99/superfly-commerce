import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';
import { ShoppingCart, Plus, Minus, X, CreditCard, ArrowLeft, CheckCircle, Package } from 'lucide-react';
import { getVerifiedLevel, isEmailVerified } from '../lib/verifiedClients';
import CheckoutModal from '../components/CheckoutModal';
import { useLanguage } from '../lib/languageContext';
import { useCurrency } from '../lib/currencyContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  category?: string;
}

const CheckoutPage = () => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hasGreenDiscount, setHasGreenDiscount] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const breadcrumbItems = [
    { label: 'Services', href: '/#services' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Checkout', href: '/checkout', current: true }
  ];

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('superflyCart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage
  const saveCart = (newCart: CartItem[]) => {
    try {
      localStorage.setItem('superflyCart', JSON.stringify(newCart));
      // Dispatch custom event for header to update
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  // Check verified levels based on email
  const getAvailableLevels = () => {
    if (customerEmail && isEmailVerified(customerEmail)) {
      return getVerifiedLevel(customerEmail) >= 2; // Level 2+ gets green discount
    }
    return false;
  };

  const isGreenDiscountAvailable = getAvailableLevels();

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      const newCart = cart.filter(item => item.id !== id);
      setCart(newCart);
      saveCart(newCart);
    } else {
      const newCart = cart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCart(newCart);
      saveCart(newCart);
    }
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    saveCart(newCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalSavings = () => {
    if (hasGreenDiscount && isGreenDiscountAvailable) {
      return getTotalPrice() * 0.20; // 20% green business discount
    }
    return 0;
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckoutOpen(true);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear all items from your cart?')) {
      setCart([]);
      saveCart([]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} />
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Cart
                <br />
                <span className="text-green-500">Ready to Get Started?</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Review your selected services and proceed with our streamlined contract process.
              </p>
            </div>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {cart.length === 0 ? (
              /* Empty Cart */
              <div className="text-center py-16">
                <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-8">Add some services to get started with your Amazon growth journey.</p>
                <a
                  href="/pricing"
                  className="inline-flex items-center px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-semibold text-lg"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Browse Services
                </a>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Selected Services</h2>
                  
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-green-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                              {item.description}
                            </p>
                            {item.category && (
                              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {item.category}
                              </span>
                            )}
                          </div>
                          
                          <div className="ml-6 text-right">
                            <div className="text-2xl font-bold text-green-500 mb-4">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center justify-end space-x-3 mb-4">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                max="99"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-16 h-8 text-center font-semibold border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium flex items-center"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8">
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 border-2 border-green-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Order Summary
                      </h3>

                      {/* Green Business Discount */}
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Green Business Discount
                        </h4>
                        
                        <div className="bg-green-50 rounded-xl p-4 mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-green-900">15% Off for Sustainable Businesses</div>
                              <div className="text-sm text-green-700">B-Corp, carbon neutral, or equivalent certification</div>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="green-discount"
                                checked={hasGreenDiscount}
                                onChange={(e) => setHasGreenDiscount(e.target.checked)}
                                disabled={!isGreenDiscountAvailable}
                                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                              />
                              <label htmlFor="green-discount" className="ml-2 text-sm font-medium text-gray-900">
                                Apply Discount
                              </label>
                            </div>
                          </div>
                          
                          {!isGreenDiscountAvailable && (
                            <div className="mt-3 text-sm text-gray-600">
                              <input
                                type="email"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
                                placeholder="Enter email to check verification status"
                              />
                              {customerEmail && !isEmailVerified(customerEmail) && (
                                <p className="text-yellow-600 text-xs mt-2">
                                  Not verified. <a href="/sustainability-verification" className="text-green-600 hover:text-green-700 underline">Apply for green discount</a>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                          <span className="font-semibold text-gray-900">
                            {formatPrice(getTotalPrice())}
                          </span>
                        </div>
                        
                        {getTotalSavings() > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Sustainability Savings</span>
                            <span className="font-semibold text-green-500">
                              -{formatPrice(getTotalSavings())}
                            </span>
                          </div>
                        )}
                        
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-green-500">
                              {formatPrice(getTotalPrice() - getTotalSavings())}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <button
                        onClick={handleProceedToCheckout}
                        className="w-full flex items-center justify-center py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold text-lg mb-4"
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pay Now & Get Started
                      </button>

                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <h5 className="font-semibold text-green-900 mb-2">What Happens Next</h5>
                            <div className="text-sm text-green-700 space-y-1">
                              <p>1. Secure payment via Stripe</p>
                              <p>2. Digital contract sent for signature</p>
                              <p>3. Project kickoff within 24 hours</p>
                              <p>4. Services begin immediately</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 text-center mt-4">
                        Secure payment via Stripe • Digital contract included
                      </p>
                      {cart.length > 0 && (
                        <button
                          onClick={handleClearCart}
                          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        sustainabilityLevel={{ name: hasGreenDiscount ? "Green Business" : "Standard", discount: hasGreenDiscount ? 15 : 0 }}
        totalAmount={getTotalPrice() - getTotalSavings()}
        totalSavings={getTotalSavings()}
        onClearCart={handleClearCart}
      />
    </div>
  );
};

export default CheckoutPage;