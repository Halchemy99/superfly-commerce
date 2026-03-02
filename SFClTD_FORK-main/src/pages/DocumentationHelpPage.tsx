import React, { useState } from 'react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';
import { FileText, Users, CheckCircle, ArrowRight, Mail, Phone, MessageCircle } from 'lucide-react';

const DocumentationHelpPage = () => {
  const breadcrumbItems = [
    { label: 'Services', href: '/#services' },
    { label: 'Documentation Help', href: '/documentation-help', current: true }
  ];

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    specialist: '',
    currentLevel: '',
    targetLevel: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.company) {
      alert('Please fill in all required fields');
      return;
    }

    const subject = '📋 Documentation Help Request - Sustainability Certification';
    const body = `Hi Superfly Commerce Team,

I need help obtaining sustainability documentation to qualify for higher discount levels.

📋 MY DETAILS:
- Name: ${contactForm.name}
- Email: ${contactForm.email}
- Company: ${contactForm.company}
- Interested in Working With: ${contactForm.specialist || 'Any specialist (we\'ll match you)'}
- Current Sustainability Level: ${contactForm.currentLevel || 'Not sure'}
- Target Level: ${contactForm.targetLevel || 'Not specified'}

📝 ADDITIONAL INFORMATION:
${contactForm.message || 'No additional information provided'}

I'm interested in working with your partners to get my business properly assessed and certified for sustainability practices. Please provide:

1. Information about your partner network
2. Set fees for documentation and certification services
3. Timeline for getting certified
4. Next steps to get started

Looking forward to hearing from you!

Best regards,
${contactForm.name}`;

    window.location.href = `mailto:harry@superflycommerce.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      company: '',
      specialist: '',
      currentLevel: '',
      targetLevel: '',
      message: ''
    });
  };

  const services = [
    {
      icon: FileText,
      title: "Documentation Review",
      description: "We'll review your current sustainability practices and identify exactly what documentation you need for certification.",
      price: "£150",
      includes: [
        "Current practices assessment",
        "Gap analysis report",
        "Documentation roadmap",
        "Certification recommendations"
      ]
    },
    {
      icon: Users,
      title: "Partner Certification",
      description: "Connect with our trusted certification partners for B-Corp, carbon tracking, and other sustainability certifications.",
      price: "Partner rates",
      includes: [
        "Vetted certification partners",
        "Discounted partner rates",
        "Application support",
        "Process guidance"
      ]
    }
  ];

  const sustainabilityLevels = [
    { level: 2, name: "Conscious Brand", discount: "15%", requirements: "Basic sustainability documentation" },
    { level: 3, name: "Impact Leader", discount: "25%", requirements: "B-Corp or equivalent certification" },
    { level: 4, name: "Planet Champion", discount: "40%", requirements: "Advanced certifications and practices" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Documentation Help
              <br />
              <span className="text-green-500">Get Certified, Save More</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We work with trusted partners to help you obtain the sustainability certifications 
              and documentation needed to qualify for higher discount levels.
            </p>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    1
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Assessment</h4>
                  <p className="text-sm text-gray-600">We review your current practices</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    2
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Certification</h4>
                  <p className="text-sm text-gray-600">Connect with our trusted partners</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    3
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Save Money</h4>
                  <p className="text-sm text-gray-600">Unlock higher discount levels</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Documentation Services
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Fixed-fee services to help you get certified and unlock sustainability discounts
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-200"
                >
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  
                  <div className="text-3xl font-bold text-blue-500 mb-4">
                    {service.price}
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {service.includes.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Discount Levels */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 mb-16">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Unlock These Discount Levels
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                {sustainabilityLevels.map((level, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-md">
                    <div className="text-3xl font-bold text-green-500 mb-2">
                      {level.discount} OFF
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {level.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {level.requirements}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <p className="text-gray-600 mb-4">
                  <strong>Example:</strong> If you spend £1,200/month on our services and achieve Level 3 certification, 
                  you'll save £300/month (£3,600/year) - easily covering certification costs!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-12 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Get Started with Documentation Help
                </h2>
                <p className="text-lg text-gray-600">
                  Tell us about your business and we'll connect you with the right certification partners
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={contactForm.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={contactForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={contactForm.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label htmlFor="specialist" className="block text-sm font-medium text-gray-700 mb-2">
                    Interested in Working With
                  </label>
                  <select
                    id="specialist"
                    name="specialist"
                    value={contactForm.specialist}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Any specialist (we'll match you)</option>
                    <option value="Sarah">Sarah (PPC & Campaign Expert)</option>
                    <option value="Marcus">Marcus (Listing & SEO Expert)</option>
                    <option value="Elena">Elena (Global Expansion Expert)</option>
                    <option value="James">James (Photography & Video Expert)</option>
                    <option value="Priya">Priya (Analytics & Data Expert)</option>
                    <option value="Alex">Alex (Launch & Strategy Expert)</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="currentLevel" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Sustainability Level
                    </label>
                    <select
                      id="currentLevel"
                      name="currentLevel"
                      value={contactForm.currentLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Not sure</option>
                      <option value="1">Level 1 - Getting Started</option>
                      <option value="2">Level 2 - Conscious Brand</option>
                      <option value="3">Level 3 - Impact Leader</option>
                      <option value="4">Level 4 - Planet Champion</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="targetLevel" className="block text-sm font-medium text-gray-700 mb-2">
                      Target Level
                    </label>
                    <select
                      id="targetLevel"
                      name="targetLevel"
                      value={contactForm.targetLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Not sure</option>
                      <option value="2">Level 2 - Conscious Brand (15% off)</option>
                      <option value="3">Level 3 - Impact Leader (25% off)</option>
                      <option value="4">Level 4 - Planet Champion (40% off)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={contactForm.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Tell us about your current sustainability practices, goals, or any specific certifications you're interested in..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold text-lg"
                >
                  Get Documentation Help
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                  Prefer to Contact Us Directly?
                </h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-gray-600">harry@superflycommerce.com</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-blue-500 mr-2" />
                    <a href="https://wa.me/447969614703" className="text-blue-600 hover:text-blue-700 transition-colors">
                      WhatsApp: +44 7969 614703
                    </a>
                  </div>
                  <div className="flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-500 mr-2" />
                    <a href="https://calendly.com/superflycommerce" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
                      Schedule Call
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentationHelpPage;