import React, { useState } from 'react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';
import { Leaf, Heart, Award, CheckCircle, ArrowRight, Mail, Shield, Globe } from 'lucide-react';
import { getVerifiedLevel, isEmailVerified } from '../lib/verifiedClients';
import SustainabilityVerification from '../components/SustainabilityVerification';
import { useLanguage } from '../lib/languageContext';

const SustainabilityVerificationPage = () => {
  const { t } = useLanguage();
  
  const breadcrumbItems = [
    { label: 'Services', href: '/#services' },
    { label: 'Sustainability Verification', href: '/sustainability-verification', current: true }
  ];
  
  const [customerEmail, setCustomerEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [selectedLevelForVerification, setSelectedLevelForVerification] = useState<any>(null);

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

  const handleLevelSelection = (level: any) => {
    if (availableLevels.includes(level.level)) {
      // Level is available, show success message
      alert(`You're already verified for ${level.name}! This discount is automatically applied to your services.`);
    } else {
      // Level needs verification
      setSelectedLevelForVerification(level);
      setShowVerification(true);
    }
  };

  const handleVerificationComplete = (verified: boolean) => {
    // Verification complete - user will need to wait for manual approval
  };

  const benefits = [
    {
      icon: Shield,
      title: "Reward Ethical Practices",
      description: "We believe sustainable businesses should be rewarded with better pricing for their positive impact."
    },
    {
      icon: Globe,
      title: "Environmental Impact",
      description: "Your sustainability practices contribute to a healthier planet and more ethical business ecosystem."
    },
    {
      icon: Heart,
      title: "Values Alignment",
      description: "We partner with businesses that share our commitment to social and environmental responsibility."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Green Business Discount
              <br />
              <span className="text-green-500">15% Off All Services</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Certified sustainable businesses get 15% off all our services. 
              Simple verification process for B-Corp, carbon neutral, or equivalent certified businesses.
            </p>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why We Offer This Discount</h3>
              <p className="text-gray-600 mb-6">
                We believe sustainable businesses deserve support. Our green discount rewards 
                certified sustainable practices and helps ethical businesses grow.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <benefit.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Email Check Section */}
        <section className="py-12 bg-white">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Check Your Verification Status
              </h2>
              <p className="text-gray-600">
                Enter your email to see if you're already verified for higher discount levels
              </p>
            </div>
            
            <div className="mb-8">
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-center"
                placeholder="your@email.com"
              />
              {customerEmail && isEmailVerified(customerEmail) && (
                <p className="text-green-600 text-sm text-center mt-2">
                  ✅ Verified up to Level {getVerifiedLevel(customerEmail)} - {sustainabilityLevels[getVerifiedLevel(customerEmail) - 1].name}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Sustainability Levels */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Green Business Discount Qualification
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Simple verification process for certified sustainable businesses.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    15% Green Business Discount
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Certified sustainable businesses qualify for 15% off all services
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">B-Corp Certified</h4>
                    <p className="text-sm text-gray-600">Verified benefit corporation status</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Globe className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Carbon Neutral</h4>
                    <p className="text-sm text-gray-600">Certified carbon neutral operations</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Equivalent Certification</h4>
                    <p className="text-sm text-gray-600">Other recognized sustainability certifications</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => setShowVerification(true)}
                    className="inline-flex items-center px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-semibold text-lg"
                  >
                    Apply for Green Discount
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Savings Calculator */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Your Potential Savings
                </h2>
                <p className="text-lg text-gray-600">
                  See how much you could save with the 15% green business discount
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-6 text-center shadow-md">
                  <div className="text-2xl font-bold text-gray-900 mb-2">£1,000/month</div>
                  <div className="text-sm text-gray-600 mb-4">Example monthly spend</div>
                  <div className="text-green-600 font-bold text-xl">Save £200/month</div>
                  <div className="text-sm text-gray-500">£2,400/year savings</div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 text-center shadow-md">
                  <div className="text-2xl font-bold text-gray-900 mb-2">£2,500/month</div>
                  <div className="text-sm text-gray-600 mb-4">Example monthly spend</div>
                  <div className="text-green-600 font-bold text-xl">Save £500/month</div>
                  <div className="text-sm text-gray-500">£6,000/year savings</div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 text-center shadow-md">
                  <div className="text-2xl font-bold text-gray-900 mb-2">£5,000/month</div>
                  <div className="text-sm text-gray-600 mb-4">Example monthly spend</div>
                  <div className="text-green-600 font-bold text-xl">Save £1,000/month</div>
                  <div className="text-sm text-gray-500">£12,000/year savings</div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-gray-600 mb-6">
                  <strong>Annual savings add up fast!</strong> A certified business spending £2,500/month 
                  saves £6,000 per year with our green discount.
                </p>
                
                <a
                  href="/pricing"
                  className="inline-flex items-center px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-semibold text-lg"
                >
                  View Services with Discount
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Verified?
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start your verification process today and unlock significant savings on all our services.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/documentation-help"
                className="inline-flex items-center px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-semibold text-lg"
              >
                Get Documentation Help
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              
              <a
                href="mailto:harry@superflycommerce.com?subject=Sustainability Verification Inquiry"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white hover:text-gray-900 transition-colors font-semibold text-lg"
              >
                <Mail className="mr-2 w-5 h-5" />
                Contact Us Directly
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />

      <SustainabilityVerification
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        selectedLevel={selectedLevelForVerification}
        onVerificationComplete={handleVerificationComplete}
      />
    </div>
  );
};

export default SustainabilityVerificationPage;