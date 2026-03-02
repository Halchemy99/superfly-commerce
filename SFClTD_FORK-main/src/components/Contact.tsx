import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowRight, MessageCircle, Calendar, Users } from 'lucide-react';
import { useLanguage } from '../lib/languageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    specialist: '',
    service: '',
    message: ''
  });
 const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // --- New API Call ---
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            company: formData.company,
            specialist: formData.specialist, 
            service: formData.service,       
            message: formData.message    
	}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSubmitStatus('success');
      // Also proceed with the mailto link as before
      const subject = `🚀 Discovery Call Request - ${formData.service || 'General Inquiry'}`;
      const body = `Hi Superfly Commerce Collective, ...`; // Your existing email body
      window.location.href = `mailto:harry@superflycommerce.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    } catch (error) {
        console.error('Form submission error:', error);
        setSubmitStatus('error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div>
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                <Users className="w-4 h-4 mr-2" />
                Partner With Us
              </span>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Ready to Grow
                <span className="text-green-500"> Sustainably?</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Book a discovery call to explore performance-based retainers and sustainability discounts. 
                No sales pitch—just honest advice about sustainable Amazon growth.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Book Discovery Call</div>
                  <a href="https://calendly.com/superflycommerce" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 transition-colors">
                    Schedule via Calendly
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mr-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">WhatsApp Us</div>
                  <a href="https://wa.me/447969614703" className="text-green-600 hover:text-green-700 transition-colors">
                    +44 7969 614703
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Email Us</div>
                  <div className="text-gray-600">harry@superflycommerce.com</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Location</div>
                  <div className="text-gray-600">Global Amazon Specialists</div>
                </div>
              </div>
            </div>

            {/* What You'll Get */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                What You'll Get on Our Call
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                  <span className="text-gray-600">Free Amazon account assessment</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                  <span className="text-gray-600">Performance-based retainer options</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                  <span className="text-gray-600">Sustainability discount assessment</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                  <span className="text-gray-600">Charitable impact breakdown</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Book Your Discovery Call
              </h3>
              <p className="text-gray-600">
                Tell us about your Amazon business and we'll design a performance-based partnership for sustainable growth.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Your company name"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="specialist" className="block text-sm font-medium text-gray-700 mb-2">
                    Interested in Working With
                  </label>
                  <select
                    id="specialist"
                    name="specialist"
                    value={formData.specialist}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
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

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Interest
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select service</option>
                    <option value="Amazon Sprint Packages">Amazon Sprint Packages (Fixed-Price)</option>
                    <option value="Amazon Dream Team">Amazon Dream Team (Curated Specialists)</option>
                    <option value="Growth Share Partnership">Growth Share Partnership (Performance-Based)</option>
                    <option value="Amazon Mastery Academy">Amazon Mastery Academy (Training & Advisory)</option>
                    <option value="Not sure - need guidance">Not sure - need guidance</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Tell Us About Your Amazon Goals
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="What are your biggest Amazon challenges? Are you interested in performance-based partnerships?"
                />
              </div>

              <button
                type="submit"
                className="w-full group flex items-center justify-center px-8 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold text-lg transform hover:scale-[1.02] transition-transform duration-300"
              >
                Book Discovery Call
                <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Free consultation • Performance-based options • Sustainability discounts available
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
