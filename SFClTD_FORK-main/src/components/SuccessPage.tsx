import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, Mail, ArrowRight, Coins } from 'lucide-react';
import { useLanguage } from '../lib/languageContext';

const SuccessPage = () => {
  const { t } = useLanguage();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('stripe');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdParam = urlParams.get('session_id');
    const chargeIdParam = urlParams.get('charge_id');
    const paymentIdParam = urlParams.get('payment_id');
    const paymentMethodParam = urlParams.get('payment_method') || 'stripe';
    
    setSessionId(sessionIdParam || chargeIdParam || paymentIdParam);
    setPaymentMethod(paymentMethodParam);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-3xl p-12 shadow-2xl">
          {/* Success Icon */}
          {t.thankYouMessage}
            {paymentMethod === 'crypto' ? (
              <Coins className="w-12 h-12 text-green-500" />
            ) : paymentMethod === 'wechat' ? (
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">微</span>
              </div>
            ) : paymentMethod === 'alipay' ? (
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">支</span>
              </div>
            ) : (
              <CheckCircle className="w-12 h-12 text-green-500" />
            )}
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t.whatHappensNext}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Thank you for choosing Superfly Commerce! Your custom service package has been successfully purchased
            {paymentMethod === 'crypto' && (
              <span className="text-orange-600 font-semibold"> via cryptocurrency</span>
            )}
            {paymentMethod === 'wechat' && (
              <span className="text-green-600 font-semibold"> via WeChat Pay (微信支付)</span>
            )}
            {paymentMethod === 'alipay' && (
              <span className="text-blue-600 font-semibold"> via Alipay (支付宝)</span>
            )}
            {paymentMethod === 'paypal' && (
              <span className="text-blue-600 font-semibold"> via PayPal</span>
            )}
            {paymentMethod === 'paytm' && (
              <span className="text-indigo-600 font-semibold"> via Paytm</span>
            )}
            {paymentMethod === 'googlepay' && (
              <span className="text-red-600 font-semibold"> via Google Pay</span>
            )}
            .
          </p>

          {/* What Happens Next */}
          <div className="bg-green-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What Happens Next?
            </h2>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Confirmation Email</h3>
                  <p className="text-gray-600">
                    You'll receive a detailed receipt and service breakdown within 5 minutes
                    {(paymentMethod === 'crypto' || paymentMethod === 'wechat' || paymentMethod === 'alipay' || paymentMethod === 'paypal' || paymentMethod === 'paytm') && 
                      ' (digital payments may take longer to confirm)'}.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Project Kickoff</h3>
                  <p className="text-gray-600">Our team will contact you within 24 hours to schedule your project kickoff call.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Service Delivery</h3>
                <h3 className="font-semibold text-gray-900 mb-1">{t.serviceDelivery}</h3>
                <p className="text-gray-600">{t.serviceDeliveryDesc}</p>
              </div>
            </div>
          </div>

          {paymentMethod === 'crypto' && (
            <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
              <p className="text-sm text-orange-700 text-center">
                <strong>Crypto Payment Note:</strong> Your payment is being processed on the blockchain. You'll receive confirmation once the transaction is confirmed.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:harry@superflycommerce.com"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
            >
              <Mail className="w-5 h-5 mr-2" />
              {t.contactUs}
            </a>
            
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 border-2 border-green-500 text-green-500 rounded-xl hover:bg-green-50 transition-colors font-semibold"
            >
              {t.backToHome}
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>

          {/* Session ID for Reference */}
          {sessionId && (
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">
                <strong>{t.orderReference}</strong> {sessionId}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;