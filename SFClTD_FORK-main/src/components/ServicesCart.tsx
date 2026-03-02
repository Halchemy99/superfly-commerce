import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Check, Info, CreditCard, Play, X, FileText, Globe, BarChart3, Image, Palette, Search, Store, ArrowRight } from 'lucide-react';
import { ONE_TIME_SERVICES, type CartItem } from '../lib/stripe';
import { getVerifiedLevel, isEmailVerified } from '../lib/verifiedClients';
import CheckoutModal from './CheckoutModal';
import SustainabilityVerification from './SustainabilityVerification';
import { useLanguage } from '../lib/languageContext';

const ServicesCart = () => {
  const { t } = useLanguage();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sustainabilityLevel, setSustainabilityLevel] = useState(1);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [selectedLevelForVerification, setSelectedLevelForVerification] = useState<any>(null);
  const [selectedServicePreview, setSelectedServicePreview] = useState<string | null>(null);

  // Check verified levels based on email
  const getAvailableLevels = () => {
    const levels = [1]; // Level 1 always available
    if (customerEmail && isEmailVerified(customerEmail)) {
      const verifiedLevel = getVerifiedLevel(customerEmail);
      for (let i = 2; i <= verifiedLevel; i++) {
        levels.push(i);
      }
    }
    return levels;
  };

  const availableLevels = getAvailableLevels();

  const sustainabilityLevels = [
    { level: 1, name: "Getting Started", discount: 0, color: "bg-gray-100 text-gray-600" },
    { level: 2, name: "Conscious Brand", discount: 15, color: "bg-yellow-100 text-yellow-600" },
    { level: 3, name: "Impact Leader", discount: 25, color: "bg-green-100 text-green-600" },
    { level: 4, name: "Planet Champion", discount: 40, color: "bg-emerald-100 text-emerald-600" }
  ];

  const getServiceIcon = (serviceId: string) => {
    const iconMap: { [key: string]: any } = {
      'ppc-audit': BarChart3,
      'listing-optimization': Search,
      'keyword-research': FileText,
      'brand-store-setup': Store,
      'main-images': Image,
      'infographics': Palette,
      'a-plus-content': FileText,
      'brand-story': FileText,
      'brand-store': Store,
      'sustainability-audit': Globe,
      'global-expansion': Globe
    };
    return iconMap[serviceId] || FileText;
  };

  const getServiceSampleContent = (serviceId: string) => {
    const sampleContent: { [key: string]: any } = {
      'ppc-audit': {
        type: 'report',
        title: 'Sample PPC Audit Report',
        content: {
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          highlights: [
            'Campaign structure analysis',
            'Keyword performance review',
            'Bid optimization recommendations',
            'Negative keyword suggestions',
            'ROAS improvement strategies'
          ],
          sampleImage: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
      },
      'listing-optimization': {
        type: 'before-after',
        title: 'Listing Optimization Examples',
        content: {
          beforeImage: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600',
          afterImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
          improvements: [
            'SEO-optimized title with high-volume keywords',
            'Compelling bullet points highlighting benefits',
            'Professional product images with lifestyle shots',
            'Enhanced A+ content with brand story',
            'Optimized backend search terms'
          ]
        }
      },
      'global-expansion': {
        type: 'strategy',
        title: 'Global Expansion Strategy Sample',
        content: {
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          strategyPoints: [
            'Market analysis for EU, US, and APAC regions',
            'VAT registration and compliance guidance',
            'Currency and pricing strategy',
            'Localization requirements by country',
            'Logistics and fulfillment setup',
            'Legal compliance and documentation'
          ],
          sampleImage: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
      },
      'brand-story': {
        type: 'video',
        title: 'Brand Story Development Sample',
        content: {
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          elements: [
            'Brand origin and founder story',
            'Mission and values alignment',
            'Sustainability journey narrative',
            'Customer impact stories',
            'Visual brand identity guidelines'
          ],
          sampleImage: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
      },
      'main-images': {
        type: 'gallery',
        title: 'Professional Product Images',
        content: {
          images: [
            'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
            'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
            'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600'
          ],
          features: [
            'High-resolution product photography',
            'Multiple angles and lifestyle shots',
            'Amazon-compliant image specifications',
            'Professional lighting and composition',
            'Brand-consistent styling'
          ]
        }
      }
    };
    
    return sampleContent[serviceId] || {
      type: 'info',
      title: 'Service Preview',
      content: {
        description: 'Detailed preview coming soon. Contact us for samples and examples.',
        sampleImage: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    };
  };

  const services = Object.entries(ONE_TIME_SERVICES).map(([key, service]) => ({
    id: key,
    name: service.name,
    price: service.basePrice,
    description: service.description,
    icon: getServiceIcon(key),
    sampleContent: getServiceSampleContent(key)
  }));

  const calculateDiscountedPrice = (basePrice: number) => {
    const currentLevel = sustainabilityLevels[sustainabilityLevel - 1];
    // Only apply discount if level is available (verified or level 1)
    if (availableLevels.includes(currentLevel.level)) {
      const discountAmount = (basePrice * currentLevel.discount) / 100;
      return basePrice - discountAmount;
    }
    return basePrice; // No discount if not verified
  };

  const handleLevelSelection = (level: any) => {
    if (availableLevels.includes(level.level)) {
      // Level is available, select it
      setSustainabilityLevel(level.level);
    } else {
      // Level needs verification
      setSelectedLevelForVerification(level);
      setShowVerification(true);
    }
  };

  const handleVerificationComplete = (verified: boolean) => {
    // Verification complete - user will need to wait for manual approval
    // Their level will be available once added to verifiedClients.ts
  };

  const addToCart = (service: { id: string; name: string; price: number; description: string }) => {
    const existingItem = cart.find(item => item.id === service.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === service.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: service.id,
        name: service.name,
        price: calculateDiscountedPrice(service.price),
        quantity: 1,
        description: service.description
      }]);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalSavings = () => {
    const originalTotal = cart.reduce((total, item) => {
      const originalService = services.find(s => s.id === item.id);
      return total + (originalService ? originalService.price * item.quantity : 0);
    }, 0);
    return originalTotal - getTotalPrice();
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckoutOpen(true);
  };
  
  return (
    <section id="services-cart" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Add-On Services
            <br />
            <span className="text-green-500">Enhance Your Subscription</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            One-time services to complement your monthly subscription. Perfect for specific projects or getting started faster.
          </p>
          <div className="mt-6 inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            💡 These are add-ons to enhance your subscription services
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Services Selection */}
          <div className="lg:col-span-2">
            {/* Subscription Reminder */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 mb-8 border border-green-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">!</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Need ongoing support?</h3>
              </div>
              <p className="text-gray-700 mb-4">
                These are one-time add-on services. For ongoing Amazon management, check out our 
                <a href="#pricing" className="text-green-600 font-semibold hover:text-green-700 mx-1">monthly subscriptions</a>
                with no minimum commitment.
              </p>
              <a 
                href="#pricing" 
                className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors"
              >
                View Subscription Plans
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Sustainability Level Selector */}
            <div className="mb-12">
              {/* Email Input for Verification Check */}
              <div className="max-w-md mx-auto mb-8">
                <label htmlFor="email-check" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  {t.enterEmailCheck || "Enter your email to check verified sustainability level"}
                </label>
                <input
                  type="email"
                  id="email-check"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-center"
                  placeholder={t.yourEmail || "your@email.com"}
                />
                {customerEmail && isEmailVerified(customerEmail) && (
                  <p className="text-green-600 text-sm text-center mt-2">
                    {t.verifiedUpTo || "✅ Verified up to Level"} {getVerifiedLevel(customerEmail)} - {sustainabilityLevels[getVerifiedLevel(customerEmail) - 1].name}
                  </p>
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t.selectSustainabilityLevel || "Select Your Sustainability Level"}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {sustainabilityLevels.map((level, index) => (
                  <div
                    key={index}
                    onClick={() => handleLevelSelection(level)}
                    className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                      sustainabilityLevel === level.level
                        ? 'border-green-500 bg-green-50'
                        : availableLevels.includes(level.level)
                        ? 'border-gray-200 bg-white hover:border-green-300'
                        : 'border-gray-200 bg-gray-50 hover:border-yellow-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 ${level.color} rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3`}>
                        {level.level}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{level.name}</h4>
                      
                      {availableLevels.includes(level.level) ? (
                        <div className="text-2xl font-bold text-green-500">
                          {level.discount}% OFF
                        </div>
                      ) : level.level === 1 ? (
                        <div className="text-2xl font-bold text-gray-500">
                          {level.discount}% OFF
                        </div>
                      ) : (
                        <>
                          <div className="text-xl font-bold text-gray-400 mb-2">
                            {level.discount}% OFF
                          </div>
                          <div className="text-sm font-semibold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                            {t.verificationRequired || "Verification Required"}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {!availableLevels.includes(level.level) && level.level > 1 && (
                      <div className="mt-4 text-center">
                        <span className="text-xs text-yellow-600 font-medium">
                          {t.clickToUpload || "Click to upload verification docs"}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">Available Add-On Services</h3>
              
              {services.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <p className="text-gray-500 text-lg mb-4">{t.noServicesAvailable || "No services available at the moment"}</p>
                  <p className="text-gray-400">{t.checkBackSoon || "Please check back soon for new service offerings"}</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="group bg-white border-2 border-blue-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 relative"
                    >
                      {/* Add-on Badge */}
                      <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        ADD-ON
                      </div>
                      
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                            <service.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 
                              className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                              onClick={() => setSelectedServicePreview(service.id)}
                            >
                              {service.name}
                            </h4>
                            <button
                              onClick={() => setSelectedServicePreview(service.id)}
                              className="text-xs text-blue-500 hover:text-blue-600 transition-colors flex items-center"
                            >
                              <Play className="w-3 h-3 mr-1" />
                              View Sample
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          {sustainabilityLevels[sustainabilityLevel - 1].discount > 0 && availableLevels.includes(sustainabilityLevel) && (
                            <div className="text-xs text-gray-500 line-through mb-1">
                              £{service.price}
                            </div>
                          )}
                          <div className="text-xl font-bold text-green-500">
                            £{Math.round(calculateDiscountedPrice(service.price))} <span className="text-sm text-gray-500 font-normal">one-time</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                      
                      {/* Savings Badge */}
                      {sustainabilityLevels[sustainabilityLevel - 1].discount > 0 && availableLevels.includes(sustainabilityLevel) && (
                        <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-4">
                          💰 Save £{Math.round(service.price - calculateDiscountedPrice(service.price))}
                        </div>
                      )}
                      
                      {/* Add to Cart Button */}
                      <button
                        onClick={() => addToCart(service)}
                        className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 font-semibold text-sm group-hover:shadow-lg transform group-hover:scale-105"
                      >
                        <span className="mr-2">+</span>
                        {t.addToCart || "Add to Cart"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200">
                <div className="flex items-center mb-6">
                  <ShoppingCart className="w-6 h-6 text-blue-500 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Add-On Cart</h3>
                </div>

                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No add-on services selected yet. These complement your monthly subscription.
                  </p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {item.name}
                            </h4>
                            <div className="text-green-500 font-bold">
                              £{item.price.toFixed(0)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                              >
                                <span className="text-sm font-bold">-</span>
                              </button>
                              <input
                                type="number"
                                min="1"
                                max="99"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-12 h-8 text-center font-semibold border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                              >
                                <span className="text-sm font-bold">+</span>
                              </button>
                            </div>
                            <div className="text-gray-900 font-bold">
                              £{Math.round(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      {getTotalSavings() > 0 && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">{t.totalSavings || "Total Savings"}</span>
                          <span className="font-bold text-blue-500">
                            £{Math.round(getTotalSavings())}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-bold text-gray-900">{t.total || "Total"}</span>
                        <span className="text-2xl font-bold text-blue-500">
                          £{Math.round(getTotalPrice())} <span className="text-sm text-gray-500 font-normal">one-time</span>
                        </span>
                      </div>
                      <button 
                        onClick={handleProceedToCheckout}
                        className="w-full flex items-center justify-center py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold text-lg"
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        {t.proceedToCheckout || "Proceed to Checkout"}
                      </button>
                      <p className="text-xs text-gray-500 text-center mt-3">
                        One-time payment • Add-on services to enhance your subscription
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Preview Modal */}
      {selectedServicePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative p-8">
              <button
                onClick={() => setSelectedServicePreview(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {(() => {
                const service = services.find(s => s.id === selectedServicePreview);
                if (!service) return null;

                const content = service.sampleContent;
                const ServiceIcon = service.icon;

                return (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mr-4">
                        <ServiceIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">{service.name}</h2>
                        <p className="text-gray-600">{content.title}</p>
                      </div>
                    </div>

                    {content.type === 'video' && content.content.videoUrl && (
                      <div className="mb-8">
                        <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-4">
                          <iframe
                            src={content.content.videoUrl}
                            className="w-full h-full"
                            frameBorder="0"
                            allowFullScreen
                            title={`${service.name} Sample Video`}
                          />
                        </div>
                        {content.content.elements && (
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included:</h3>
                            <ul className="grid md:grid-cols-2 gap-3">
                              {content.content.elements.map((element: string, idx: number) => (
                                <li key={idx} className="flex items-center text-gray-700">
                                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                  {element}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {content.type === 'report' && (
                      <div className="grid lg:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Sample Report Includes:</h3>
                          <ul className="space-y-3 mb-6">
                            {content.content.highlights.map((highlight: string, idx: number) => (
                              <li key={idx} className="flex items-start text-gray-700">
                                <BarChart3 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                          {content.content.videoUrl && (
                            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                              <iframe
                                src={content.content.videoUrl}
                                className="w-full h-full"
                                frameBorder="0"
                                allowFullScreen
                                title="Sample Report Walkthrough"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <img
                            src={content.content.sampleImage}
                            alt="Sample Report"
                            className="w-full h-80 object-cover rounded-2xl"
                          />
                        </div>
                      </div>
                    )}

                    {content.type === 'strategy' && (
                      <div className="space-y-8">
                        <div className="grid lg:grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Strategy Components:</h3>
                            <ul className="space-y-3">
                              {content.content.strategyPoints.map((point: string, idx: number) => (
                                <li key={idx} className="flex items-start text-gray-700">
                                  <Globe className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <img
                              src={content.content.sampleImage}
                              alt="Global Strategy"
                              className="w-full h-80 object-cover rounded-2xl"
                            />
                          </div>
                        </div>
                        {content.content.videoUrl && (
                          <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden">
                            <iframe
                              src={content.content.videoUrl}
                              className="w-full h-full"
                              frameBorder="0"
                              allowFullScreen
                              title="Global Expansion Strategy Overview"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {content.type === 'before-after' && (
                      <div className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Before</h3>
                            <img
                              src={content.content.beforeImage}
                              alt="Before Optimization"
                              className="w-full h-60 object-cover rounded-2xl"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-green-600 mb-4 text-center">After</h3>
                            <img
                              src={content.content.afterImage}
                              alt="After Optimization"
                              className="w-full h-60 object-cover rounded-2xl"
                            />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Optimization Improvements:</h3>
                          <ul className="grid md:grid-cols-2 gap-3">
                            {content.content.improvements.map((improvement: string, idx: number) => (
                              <li key={idx} className="flex items-start text-gray-700">
                                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {content.type === 'gallery' && (
                      <div className="space-y-8">
                        <div className="grid md:grid-cols-3 gap-6">
                          {content.content.images.map((image: string, idx: number) => (
                            <img
                              key={idx}
                              src={image}
                              alt={`Sample ${idx + 1}`}
                              className="w-full h-48 object-cover rounded-2xl"
                            />
                          ))}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Image Features:</h3>
                          <ul className="grid md:grid-cols-2 gap-3">
                            {content.content.features.map((feature: string, idx: number) => (
                              <li key={idx} className="flex items-start text-gray-700">
                                <Image className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {content.type === 'info' && (
                      <div className="text-center py-12">
                        <img
                          src={content.content.sampleImage}
                          alt="Service Preview"
                          className="w-full h-60 object-cover rounded-2xl mb-6"
                        />
                        <p className="text-gray-600 text-lg">{content.content.description}</p>
                      </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold text-green-500">
                          £{Math.round(calculateDiscountedPrice(service.price))}
                        </div>
                        {sustainabilityLevels[sustainabilityLevel - 1].discount > 0 && availableLevels.includes(sustainabilityLevel) && (
                          <div className="text-sm text-gray-500">
                            Save £{Math.round(service.price - calculateDiscountedPrice(service.price))} with your sustainability level
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          addToCart(service);
                          setSelectedServicePreview(null);
                        }}
                        className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add One-Time Service
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        sustainabilityLevel={sustainabilityLevels[sustainabilityLevel - 1]}
        totalAmount={getTotalPrice()}
        totalSavings={getTotalSavings()}
      />

      <SustainabilityVerification
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        selectedLevel={selectedLevelForVerification}
        onVerificationComplete={handleVerificationComplete}
      />
    </section>
  );
};

export default ServicesCart;