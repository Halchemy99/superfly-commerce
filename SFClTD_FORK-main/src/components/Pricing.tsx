import React, { useState } from 'react';
import { Check, Leaf, Heart, Award, ArrowRight, Info, Package, Clock, Target, Zap, TrendingUp, Users, Video, Camera, BarChart3, Search, Globe, GraduationCap, Store, Palette, Play, FileText } from 'lucide-react';
import { getVerifiedLevel, isEmailVerified } from '../lib/verifiedClients';
import { ONE_TIME_SERVICES, calculateVolumeDiscount, getAcademyPricing, type ServiceCategory, type CartItem } from '../lib/stripe';
import SustainabilityVerification from './SustainabilityVerification';
import VerticalVideoServiceCard from './VerticalVideoServiceCard';
import LandscapeVideoServiceCard from './LandscapeVideoServiceCard';
import CheckoutModal from './CheckoutModal';
import { useLanguage } from '../lib/languageContext';
import { useCurrency } from '../lib/currencyContext';

const Pricing = () => {
  const { t } = useLanguage();
  const { currency, setCurrency, formatPrice, exchangeRates } = useCurrency();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sustainabilityLevel, setSustainabilityLevel] = useState(1);
  const [customerEmail, setCustomerEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [selectedLevelForVerification, setSelectedLevelForVerification] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [teamMembersCount, setTeamMembersCount] = useState<{ [key: string]: number }>({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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
    {
      level: 1,
      name: t.gettingStarted || "Getting Started",
      description: "Beginning your sustainability journey",
      discount: 0,
      color: "bg-gray-100 text-gray-600",
      requirements: ["Basic sustainability commitment", "Willingness to improve"]
    },
    {
      level: 2,
      name: t.consciousBrand || "Conscious Brand",
      description: "Implementing sustainable practices",
      discount: 15,
      color: "bg-yellow-100 text-yellow-600",
      requirements: ["Sustainable packaging", "Ethical sourcing policy", "Carbon footprint tracking"]
    },
    {
      level: 3,
      name: t.impactLeader || "Impact Leader",
      description: "Leading by example in sustainability",
      discount: 25,
      color: "bg-green-100 text-green-600",
      requirements: ["B-Corp certified or equivalent", "Regenerative practices", "Supply chain transparency", "Community impact programs"]
    },
    {
      level: 4,
      name: t.planetChampion || "Planet Champion",
      description: "Setting the gold standard for ethical business",
      discount: 40,
      color: "bg-emerald-100 text-emerald-600",
      requirements: ["Carbon negative operations", "Circular economy model", "Fair trade certification", "Biodiversity restoration projects"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services', icon: Package },
    { id: 'listing', name: 'Listing Services', icon: FileText },
    { id: 'content', name: 'Content Creation', icon: FileText },
    { id: 'design', name: 'Design & Stores', icon: Palette },
    { id: 'video', name: 'Video Production', icon: Video },
    { id: 'photography', name: 'Photography', icon: Camera },
    { id: 'ppc', name: 'PPC & Advertising', icon: BarChart3 },
    { id: 'strategy', name: 'Strategy & Management', icon: Target },
    { id: 'compliance', name: 'Compliance & Setup', icon: Globe },
    { id: 'training', name: 'Training & Academy', icon: GraduationCap },
    { id: 'integration', name: 'Platform Integration', icon: Zap }
  ];

  const getServiceIcon = (serviceId: string) => {
    const iconMap: { [key: string]: any } = {
      'listing-transformation': FileText,
      'keyword-analysis': Search,
      'a-plus-content': Palette,
      'brand-story': FileText,
      'vertical-video-15': Video,
      'vertical-video-30': Video,
      'vertical-video-45': Video,
      'vertical-video-studio': Video,
      'landscape-video-15': Video,
      'landscape-video-30': Video,
      'landscape-video-45': Video,
      'landscape-video-studio': Video,
      'video-conversion': Video,
      'ugc-videos': Video,
      'tiktok-shop-integration': Zap,
      'eu-compliance-audit': Globe,
      'usa-compliance-audit': Globe,
      'epr-setup': Globe,
      'account-strategy': Target,
      'brand-store': Store,
      'main-images': Camera,
      'product-photography': Camera,
      'ppc-launch-tester': BarChart3,
      'amazon-mastery-academy': GraduationCap,
      'shopify-integration': Zap,
      'fulfillment-integration': Zap
    };
    return iconMap[serviceId] || Package;
  };

  const calculatePrice = (basePrice: number, sustainabilityDiscount: number = 0) => {
    const discountAmount = (basePrice * sustainabilityDiscount) / 100;
    return basePrice - discountAmount;
  };

  const calculateServicePrice = (serviceId: string, quantity: number = 1) => {
    const service = ONE_TIME_SERVICES[serviceId as keyof typeof ONE_TIME_SERVICES];
    let basePrice = service.basePrice;
    
    // Special handling for training academy
    if (serviceId === 'amazon-mastery-academy') {
      basePrice = getAcademyPricing(quantity);
    } else {
      // Apply volume discount
      const volumeDiscount = calculateVolumeDiscount(serviceId, quantity);
      basePrice = basePrice * (1 - volumeDiscount / 100);
    }
    
    // Apply sustainability discount
    const currentLevel = sustainabilityLevels[sustainabilityLevel - 1];
    if (availableLevels.includes(currentLevel.level)) {
      return calculatePrice(basePrice, currentLevel.discount);
    }
    
    return basePrice;
  };

  const handleLevelSelection = (level: any) => {
    if (availableLevels.includes(level.level)) {
      setSustainabilityLevel(level.level);
    } else {
      setSelectedLevelForVerification(level);
      setShowVerification(true);
    }
  };

  const handleVerificationComplete = (verified: boolean) => {
    // Verification complete - user will need to wait for manual approval
  };

  const addToCart = (serviceId: string, serviceName: string, quantity: number = 1, teamMembers: number = 1) => {
    let finalPrice = calculateServicePrice(serviceId, quantity);
    
    // Add team member cost for training academy
    if (serviceId === 'amazon-mastery-academy' && teamMembers > 1) {
      const teamMemberCost = (teamMembers - 1) * 20;
      const baseHourlyRate = getAcademyPricing(quantity);
      const totalHourlyRate = baseHourlyRate + teamMemberCost;
      finalPrice = calculatePrice(totalHourlyRate, sustainabilityLevels[sustainabilityLevel - 1].discount);
    }
    
    const service = ONE_TIME_SERVICES[serviceId as keyof typeof ONE_TIME_SERVICES];
    
    // Get existing cart from localStorage
    let existingCart: CartItem[] = [];
    try {
      const savedCart = localStorage.getItem('superflyCart');
      if (savedCart) {
        existingCart = JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }

    const existingItem = existingCart.find(item => item.id === serviceId);
    let newCart: CartItem[];
    
    if (existingItem) {
      newCart = existingCart.map(item =>
        item.id === serviceId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...existingCart, {
        id: serviceId,
        name: teamMembers > 1 ? `${serviceName} (${teamMembers} team members)` : serviceName,
        price: finalPrice,
        quantity: quantity,
        description: service.description,
        category: service.category
      }];
    }

    // Save to localStorage and update state
    try {
      localStorage.setItem('superflyCart', JSON.stringify(newCart));
      setCart(newCart);
      // Dispatch custom event for header to update
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalSavings = () => {
    const originalTotal = cart.reduce((total, item) => {
      const originalService = Object.entries(ONE_TIME_SERVICES).find(([key]) => key === item.id);
      if (originalService) {
        const [, service] = originalService;
        return total + (service.basePrice * item.quantity);
      }
      return total;
    }, 0);
    return originalTotal - getTotalPrice();
  };

  const updateQuantity = (serviceId: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [serviceId]: Math.max(1, newQuantity)
    }));
  };

  const updateTeamMembers = (serviceId: string, newTeamMembers: number) => {
    setTeamMembersCount(prev => ({
      ...prev,
      [serviceId]: Math.max(1, newTeamMembers)
    }));
  };

  const getFilteredServices = () => {
    const services = Object.entries(ONE_TIME_SERVICES);
    if (selectedCategory === 'all') return services;
    return services.filter(([_, service]) => service.category === selectedCategory);
  };

  const getSpecialistFaces = () => {
    return [
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100"
    ];
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Currency Selector */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full p-2 shadow-lg border border-gray-200">
              <div className="flex space-x-1">
                {Object.keys(exchangeRates).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      currency === curr
                        ? 'bg-green-500 text-white'
                        : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
            <Package className="w-4 h-4 mr-2" />
            Sustainable Amazon Collective
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Transparent Pricing.
            <br />
            <span className="text-green-500">Fair Specialist Pay.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Our collective cuts through heavy agency fees. Specialists get paid what they're worth, 
            you get transparent pricing with sustainability rewards.
          </p>
          
          {/* Collective Benefits */}
          <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Our Collective Model Works</h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-2xl font-bold text-green-500 mb-2">Fair Pay</div>
                <div className="text-sm text-gray-600">Specialists paid what they're worth</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-2xl font-bold text-green-500 mb-2">No Bloat</div>
                <div className="text-sm text-gray-600">Cut through agency markups</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-2xl font-bold text-green-500 mb-2">Volume Savings</div>
                <div className="text-sm text-gray-600">Better rates for larger projects</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-2xl font-bold text-green-500 mb-2">Sustainable</div>
                <div className="text-sm text-gray-600">Rewards for green practices</div>
              </div>
            </div>
          </div>
        </div>
        {/* Category Filter */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Our Collective Services
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as ServiceCategory | 'all')}
                className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300'
                }`}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {getFilteredServices().map(([serviceId, service]) => {
              const quantity = quantities[serviceId] || 1;
              const teamMembers = teamMembersCount[serviceId] || 1;
              const volumeDiscount = calculateVolumeDiscount(serviceId, quantity);
              const finalPrice = calculateServicePrice(serviceId, quantity);
              const ServiceIcon = getServiceIcon(serviceId);
              const faces = getSpecialistFaces();
              
              // Special handling for vertical video services
              if (serviceId === 'vertical-video-15') {
                return (
                  <VerticalVideoServiceCard
                    key="vertical-video-block"
                    sustainabilityLevel={sustainabilityLevel}
                    availableLevels={availableLevels}
                    sustainabilityLevels={sustainabilityLevels}
                    faces={faces}
                    onGetQuote={() => {}}
                    onAddToCart={addToCart}
                  />
                );
              }
              
              // Special handling for landscape video services
              if (serviceId === 'landscape-video-15') {
                return (
                  <LandscapeVideoServiceCard
                    key="landscape-video-block"
                    sustainabilityLevel={sustainabilityLevel}
                    availableLevels={availableLevels}
                    sustainabilityLevels={sustainabilityLevels}
                    faces={faces}
                    onGetQuote={() => {}}
                    onAddToCart={addToCart}
                  />
                );
              }
              
              // Skip individual duration services as they're now in blocks
              if (serviceId.includes('vertical-video-') && serviceId !== 'vertical-video-studio') {
                return null;
              }
              if (serviceId.includes('landscape-video-') && serviceId !== 'landscape-video-studio') {
                return null;
              }
              
              return (
                <div
                  key={serviceId}
                  className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-200 hover:border-green-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                        <ServiceIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          {service.name}
                        </h4>
                        <div className="text-xs text-gray-500 capitalize">
                          {service.category} service
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Specialist Faces */}
                  <div className="flex items-center mb-4">
                    <div className="flex -space-x-2 mr-3">
                      {faces.slice(0, 3).map((face, idx) => (
                        <img
                          key={idx}
                          src={face}
                          alt={`Specialist ${idx + 1}`}
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      Collective specialists available
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Quantity Selector - All Services */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {serviceId === 'amazon-mastery-academy' ? 'Training Hours' : 'Quantity'}
                      {service.volumeDiscounts && ' (Volume discounts available)'}
                      {serviceId === 'amazon-mastery-academy' && ' (Sliding scale pricing)'}
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(serviceId, quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <span className="text-sm font-bold">-</span>
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={quantity}
                        onChange={(e) => updateQuantity(serviceId, parseInt(e.target.value) || 1)}
                        className="w-16 h-8 text-center font-semibold border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      {serviceId === 'amazon-mastery-academy' && (
                        <span className="text-sm text-gray-600">hours</span>
                      )}
                      {serviceId === 'epr-setup' && (
                        <span className="text-sm text-gray-600">marketplaces</span>
                      )}
                      <button
                        onClick={() => updateQuantity(serviceId, quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <span className="text-sm font-bold">+</span>
                      </button>
                    </div>
                    
                    {/* Show relevant pricing info */}
                    {volumeDiscount > 0 && (
                      <div className="mt-2 text-xs text-green-600 font-medium">
                        {volumeDiscount}% volume discount applied
                      </div>
                    )}
                    {serviceId === 'amazon-mastery-academy' && (
                      <div className="mt-2 text-xs text-blue-600 font-medium">
                        £{getAcademyPricing(quantity)}/hour at {quantity} hours
                      </div>
                    )}
                    {serviceId === 'epr-setup' && quantity > 1 && (
                      <div className="mt-2 text-xs text-blue-600 font-medium">
                        Setup for {quantity} EU marketplaces
                      </div>
                    )}
                  </div>
                  
                  {/* Team Members Selector - Only for Amazon Mastery Academy */}
                  {serviceId === 'amazon-mastery-academy' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team Members (+£20 per additional person)
                      </label>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateTeamMembers(serviceId, teamMembers - 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <span className="text-sm font-bold">-</span>
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={teamMembers}
                          onChange={(e) => updateTeamMembers(serviceId, parseInt(e.target.value) || 1)}
                          className="w-16 h-8 text-center font-semibold border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-600">people</span>
                        <button
                          onClick={() => updateTeamMembers(serviceId, teamMembers + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <span className="text-sm font-bold">+</span>
                        </button>
                      </div>
                      
                      <div className="mt-2 text-xs text-purple-600 font-medium">
                        {teamMembers === 1 ? 'Individual training' : `Team training for ${teamMembers} people (+£${(teamMembers - 1) * 20} team cost)`}
                      </div>
                    </div>
                  )}
                  
                  {/* Special handling for PPC service */}
                  {serviceId === 'ppc-launch-tester' && (
                    <div className="mb-4 bg-blue-50 rounded-xl p-4">
                      <h5 className="font-semibold text-gray-900 mb-2">PPC Tiers Available:</h5>
                      <div className="space-y-2 text-xs">
                        <div>1-10 campaigns: £250 + 10% ad sales cut</div>
                        <div>10-20 campaigns: £350 + 8% ad sales cut</div>
                        <div>20-30 campaigns: £500 + 6% ad sales cut</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="text-right">
                      {sustainabilityLevels[sustainabilityLevel - 1].discount > 0 && availableLevels.includes(sustainabilityLevel) && (
                        <div className="text-sm text-gray-500 line-through mb-1">
                          £{Math.round(service.basePrice * quantity)}
                        </div>
                      )}
                      <div className="text-2xl font-bold text-green-500">
                        {formatPrice(finalPrice * quantity)}
                        {serviceId === 'amazon-mastery-academy' && teamMembers > 1 && (
                          <div className="text-sm text-gray-600 font-normal">
                            (£{Math.round(calculateServicePrice(serviceId, quantity))} + £{(teamMembers - 1) * 20} team cost)
                          </div>
                        )}
                        {serviceId === 'amazon-mastery-academy' && <span className="text-sm text-gray-500 font-normal"> total</span>}
                        {serviceId === 'account-strategy' && <span className="text-sm text-gray-500 font-normal"> per month</span>}
                        {serviceId === 'epr-setup' && <span className="text-sm text-gray-500 font-normal"> per marketplace</span>}
                        {serviceId === 'brand-story' && <span className="text-sm text-gray-500 font-normal"> per brand</span>}
                      </div>
                      
                      {/* Show savings */}
                      {(volumeDiscount > 0 || (sustainabilityLevels[sustainabilityLevel - 1].discount > 0 && availableLevels.includes(sustainabilityLevel))) && (
                        <div className="text-sm text-green-600 font-medium">
                          Save {formatPrice((service.basePrice * quantity) - (finalPrice * quantity))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Volume Discount Info */}
                  {service.volumeDiscounts && (
                    <div className="mb-4 bg-gray-50 rounded-xl p-3">
                      <h5 className="text-xs font-semibold text-gray-700 mb-2">Volume Discounts:</h5>
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                        {service.volumeDiscounts.map((tier, idx) => (
                          <div key={idx}>
                            {tier.min}+: {tier.discount}% off
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => addToCart(serviceId, service.name, quantity, teamMembers)}
                    className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold flex items-center justify-center"
                  >
                    <span className="mr-2">+</span>
                    Add to Cart
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Transparent pricing • Fair specialist pay • Sustainability rewards
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Collective Info */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 shadow-lg border border-green-200">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                How Our Collective Works
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700"><strong>Fair specialist pay:</strong> No exploitation, proper compensation</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700"><strong>Transparent fees:</strong> Simple collective fee, no hidden markups</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700"><strong>Volume savings:</strong> Better rates for larger projects</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700"><strong>Sustainability rewards:</strong> Greener practices = lower costs</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-green-500 mr-3" />
                <h4 className="text-lg font-bold text-gray-900">Join Our Collective</h4>
              </div>
              <p className="text-gray-600 mb-4">
                Ready to work with specialists who are paid fairly and cut through agency bloat? 
                Let's discuss your Amazon needs.
              </p>
              
              <a
                href="/#contact"
                className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
              >
                Book Discovery Call
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Sustainability Level Selector */}
        <div className="mb-16 text-center">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Green Business Discount Available
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Certified sustainable businesses get 15% off all services.
            </p>
            
            <div className="bg-white rounded-2xl p-6 shadow-md max-w-md mx-auto mb-6">
              <div className="text-3xl font-bold text-green-600 mb-2">20% OFF</div>
              <div className="text-lg font-semibold text-gray-700 mb-2">Sustainable Business Discount</div>
              <div className="text-sm text-gray-600">For B-Corp, carbon neutral, or equivalent certified businesses</div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/sustainability-verification"
                className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-semibold"
              >
                Apply for Green Discount
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
              
              <a
                href="/documentation-help"
                className="inline-flex items-center px-6 py-3 border-2 border-green-500 text-green-600 rounded-full hover:bg-green-50 transition-colors font-semibold"
              >
                Get Certification Help
              </a>
            </div>
          </div>
        </div>

        {/* Collective Info - After Services */}
        <div className="mb-16">
          <div className="bg-blue-50 rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Not Fussed Who Creates? Perfect!</h3>
            </div>
            <p className="text-gray-600 mb-4">
              This page shows our transparent pricing for all services. We'll match you with the best available specialist for each service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <span className="text-green-600 font-semibold">✓ Best available specialist assigned</span>
              <span className="text-green-600 font-semibold">✓ Quality guaranteed</span>
              <a href="/collective" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                Want to choose specific specialists? →
              </a>
            </div>
          </div>
        </div>

        {/* Shopping Cart */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border-2 border-green-200 p-6 max-w-sm z-40">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Cart ({cart.length})</h3>
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-bold text-green-500">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
              {getTotalSavings() > 0 && (
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="text-gray-600">Total Savings</span>
                  <span className="font-bold text-green-500">{formatPrice(getTotalSavings())}</span>
                </div>
              )}
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-green-500">{formatPrice(getTotalPrice())}</span>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
              >
                Checkout
              </button>
            </div>
          </div>
        )}

        {/* Performance-Based Options */}
        <div className="text-center bg-gray-900 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-6">
            Need Performance-Based Partnership?
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Our collective also offers performance-based retainers where fees scale with your success. 
            Perfect for ongoing Amazon growth partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#contact"
              className="inline-flex items-center px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-semibold text-lg"
            >
              Explore Performance Models
              <TrendingUp className="ml-2 w-5 h-5" />
            </a>
            <a
              href="/#services"
              className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white rounded-full hover:border-white hover:bg-white/10 transition-all duration-300 font-semibold text-lg backdrop-blur-sm"
            >
              View All Solutions
            </a>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        sustainabilityLevel={sustainabilityLevels[sustainabilityLevel - 1]}
        totalAmount={getTotalPrice()}
        totalSavings={getTotalSavings()}
        onClearCart={() => {
          if (window.confirm('Are you sure you want to clear all items from your cart?')) {
            setCart([]);
            localStorage.removeItem('superflyCart');
            window.dispatchEvent(new CustomEvent('cartUpdated'));
          }
        }}
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

export default Pricing;