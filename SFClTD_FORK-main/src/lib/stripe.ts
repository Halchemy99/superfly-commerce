import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
export const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

// One-time services for custom packages
export const ONE_TIME_SERVICES = {
  // Listing Services
  'listing-transformation': {
    name: 'Listing Transformation',
    basePrice: 200,
    description: 'Copy optimization, SEO enhancement, competitor analysis, and variant setup - clearly defined scope',
    volumeDiscounts: [
      { min: 5, discount: 5 },
      { min: 15, discount: 10 },
      { min: 25, discount: 15 },
      { min: 50, discount: 20 }
    ],
    category: 'listing'
  },
  
  'keyword-analysis': {
    name: 'Keyword Report & Analysis',
    basePrice: 150,
    description: 'Comprehensive keyword research and analysis per product',
    category: 'listing'
  },
  
  // Content Services
  'a-plus-content': {
    name: 'A+ Content Creation',
    basePrice: 600,
    description: 'Premium A+ content modules to enhance your product listings',
    volumeDiscounts: [
      { min: 3, discount: 5 },
      { min: 6, discount: 10 },
      { min: 9, discount: 15 },
      { min: 12, discount: 20 }
    ],
    category: 'content'
  },
  
  'brand-story': {
    name: 'Brand Story Development',
    basePrice: 400,
    description: 'Compelling brand story content for your Amazon presence',
    category: 'content'
  },
  
  // Video Services
  'vertical-video-15': {
    name: 'Vertical Video - 15 seconds',
    basePrice: 200,
    description: 'Animation/graphics/raw footage vertical video content',
    category: 'video'
  },
  
  'vertical-video-30': {
    name: 'Vertical Video - 30 seconds',
    basePrice: 400,
    description: 'Animation/graphics/raw footage vertical video content',
    category: 'video'
  },
  
  'vertical-video-45': {
    name: 'Vertical Video - 45 seconds',
    basePrice: 500,
    description: 'Animation/graphics/raw footage vertical video content',
    category: 'video'
  },
  
  'vertical-video-studio': {
    name: 'Vertical Video - Studio Grade',
    basePrice: 1500,
    description: 'Studio grade production with professional edit, up to 60 seconds',
    category: 'video'
  },
  
  'landscape-video-15': {
    name: 'Landscape Video - 15 seconds',
    basePrice: 200,
    description: 'Animation/graphics/raw footage landscape video content',
    category: 'video'
  },
  
  'landscape-video-30': {
    name: 'Landscape Video - 30 seconds',
    basePrice: 400,
    description: 'Animation/graphics/raw footage landscape video content',
    category: 'video'
  },
  
  'landscape-video-45': {
    name: 'Landscape Video - 45 seconds',
    basePrice: 500,
    description: 'Animation/graphics/raw footage landscape video content',
    category: 'video'
  },
  
  'landscape-video-studio': {
    name: 'Landscape Video - Studio Grade',
    basePrice: 1500,
    description: 'Studio grade production with professional edit, up to 60 seconds',
    category: 'video'
  },
  
  'video-conversion': {
    name: 'Video Format Conversion',
    basePrice: 250,
    description: 'Convert existing video between landscape and vertical formats',
    category: 'video'
  },
  
  'ugc-videos': {
    name: 'UGC Videos',
    basePrice: 50,
    description: 'User-generated content style videos for authentic marketing',
    volumeDiscounts: [
      { min: 5, discount: 5 },
      { min: 15, discount: 10 },
      { min: 25, discount: 15 },
      { min: 50, discount: 20 }
    ],
    category: 'video'
  },
  
  // Photography Services
  'main-images': {
    name: 'Main Product Images',
    basePrice: 20,
    description: 'Professional main product images optimized for Amazon',
    volumeDiscounts: [
      { min: 5, discount: 5 },
      { min: 15, discount: 10 },
      { min: 25, discount: 15 },
      { min: 50, discount: 20 }
    ],
    category: 'photography'
  },
  
  'product-photography': {
    name: 'Product Photography',
    basePrice: 25,
    description: 'Professional product photography shots',
    volumeDiscounts: [
      { min: 5, discount: 5 },
      { min: 15, discount: 10 },
      { min: 25, discount: 15 },
      { min: 50, discount: 20 }
    ],
    category: 'photography'
  },
  
  // Design Services
  'brand-store': {
    name: 'Brand Store Design',
    basePrice: 800,
    description: 'Professional Brand Store design (3-5 pages), additional pages £150 each',
    category: 'design'
  },
  
  // PPC Services
  'ppc-launch-tester': {
    name: 'PPC 30-Day Launch Tester',
    basePrice: 250,
    description: 'Full campaign setup for up to 10 campaigns + 10% ad sales cut per month',
    tiers: [
      { campaigns: '1-10', setup: 250, cut: 10 },
      { campaigns: '10-20', setup: 350, cut: 8 },
      { campaigns: '20-30', setup: 500, cut: 6 }
    ],
    category: 'ppc'
  },
  
  // Strategy & Management
  'account-strategy': {
    name: 'Account Strategy & Management',
    basePrice: 200,
    description: 'Monthly retainer: Stock management, Vine program, promotions, deals, pricing automation, coupon setup - clearly defined scope',
    category: 'strategy'
  },
  
  // Integration Services
  'tiktok-shop-integration': {
    name: 'TikTok Shop Integration',
    basePrice: 300,
    description: 'Complete TikTok Shop integration with your Amazon catalog',
    category: 'integration'
  },
  
  'shopify-integration': {
    name: 'Shopify Integration',
    basePrice: 400,
    description: 'Complete Shopify to Amazon integration setup and configuration',
    category: 'integration'
  },
  
  'fulfillment-integration': {
    name: 'Fulfillment Integration (UK Only)',
    basePrice: 350,
    description: 'UK fulfillment center integration and logistics setup',
    category: 'integration'
  },
  
  // Compliance & Setup
  'eu-compliance-audit': {
    name: 'EU Compliance Audit',
    basePrice: 250,
    description: 'Comprehensive audit of EU marketplace compliance requirements',
    category: 'compliance'
  },
  
  'epr-setup': {
    name: 'EPR Setup per Marketplace',
    basePrice: 75,
    description: 'Extended Producer Responsibility setup for EU marketplaces',
    category: 'compliance'
  },
  
  'usa-compliance-audit': {
    name: 'USA Compliance Audit',
    basePrice: 250,
    description: 'Comprehensive audit of USA marketplace compliance requirements',
    category: 'compliance'
  },
  
  // Training
  'amazon-mastery-academy': {
    name: 'Amazon Mastery Academy',
    basePrice: 50,
    description: 'Hourly training sessions, sliding scale pricing for volume bookings',
    volumeDiscounts: [
      { min: 10, price: 45 },
      { min: 20, price: 40 },
      { min: 30, price: 35 },
      { min: 50, price: 30 }
    ],
    category: 'training'
  }
} as const;

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  category?: string;
}

export interface CheckoutData {
  items: CartItem[];
  customerInfo: {
    name: string;
    email: string;
    company?: string;
  };
  sustainabilityLevel: {
    name: string;
    discount: number;
  };
  totalAmount: number;
  totalSavings: number;
}

// Calculate volume discount for a service
export const calculateVolumeDiscount = (serviceId: string, quantity: number): number => {
  const service = ONE_TIME_SERVICES[serviceId as keyof typeof ONE_TIME_SERVICES];
  if (!service.volumeDiscounts) return 0;
  
  // Find the highest applicable discount
  let discount = 0;
  for (const tier of service.volumeDiscounts) {
    if (quantity >= tier.min) {
      discount = tier.discount;
    }
  }
  
  return discount;
};

// Get pricing for training academy based on hours
export const getAcademyPricing = (hours: number): number => {
  const service = ONE_TIME_SERVICES['amazon-mastery-academy'];
  if (!service.volumeDiscounts) return service.basePrice;
  
  let price = service.basePrice;
  for (const tier of service.volumeDiscounts) {
    if (hours >= tier.min && 'price' in tier) {
      price = tier.price;
    }
  }
  
  return price;
};

// Create Stripe checkout session for one-time services
export const createCustomServicesCheckout = async (checkoutData: CheckoutData) => {
  try {
    // Mock checkout session creation for frontend-only demo
    // In production, this would call your backend API
    const mockSessionId = 'cs_test_' + Math.random().toString(36).substr(2, 9);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // For demo purposes, redirect to success page directly
    // In production, this would redirect to Stripe checkout
    window.location.href = '/success?session_id=' + mockSessionId;
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};

export type ServiceCategory = 'listing' | 'content' | 'video' | 'integration' | 'compliance' | 'strategy' | 'design' | 'photography' | 'ppc' | 'training';