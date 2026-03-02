import React from 'react';
import { Zap, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, MessageCircle, Sparkles, Video } from 'lucide-react';
import { useLanguage } from '../lib/languageContext';
import NewsletterSection from './NewsletterSection';

const Footer = () => {
  const { t } = useLanguage();
  
  const services = [
    t.tiktokMarketing,
    t.amazonPPCAds,
    t.amazonOptimization,
    t.brandStrategy,
    t.performanceAnalytics,
    t.growthAcceleration
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/superflycommerce', label: 'Facebook', name: 'Facebook' },
    { icon: Linkedin, href: 'https://linkedin.com/company/superflycommerce', label: 'LinkedIn', name: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/superflycommerce/', label: 'Instagram', name: 'Instagram' },
    { icon: MessageCircle, href: 'https://wa.me/447969614703', label: 'WhatsApp', name: 'WhatsApp' },
    { icon: Video, href: '/tiktok', label: 'TikTok', name: 'TikTok' },
    { icon: MessageCircle, href: 'https://signal.me/#eu/+447969614703', label: 'Signal', name: 'Signal' }
  ];

  return (
    <>
      <NewsletterSection />
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-4 mb-8 group">
                <img 
                  src="/1.png" 
                  alt="Superfly Commerce Logo"
                  className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg"
                />
                <div className="hidden sm:block">
                  <div className="font-black text-2xl bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 bg-clip-text text-transparent group-hover:from-green-300 group-hover:via-emerald-300 group-hover:to-green-400 transition-all duration-500">
                    SUPERFLY
                  </div>
                  <div className="font-bold text-lg text-green-400 -mt-1 tracking-wider group-hover:text-green-300 transition-colors duration-300">
                    COMMERCE
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                Remote-first, globally-driven marketing collective making Amazon fairer, greener, and smarter. 20% green business discount available.
              </p>
              
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="group relative w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-700 hover:from-green-500 hover:to-green-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/25"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xl font-bold mb-6">{t.services}</h3>
              <ul className="space-y-4">
                {services.map((service, index) => (
                  <li key={index}>
                    <a
                      href="#services"
                      className="text-gray-400 hover:text-green-500 transition-colors"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6">{t.quickLinks}</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#about" className="text-gray-400 hover:text-green-500 transition-colors">
                    {t.aboutUs}
                  </a>
                </li>
                <li>
                  <a href="/collective" className="text-gray-400 hover:text-green-500 transition-colors">
                    Meet Our Collective
                  </a>
                </li>
                <li>
                  <a href="/collective-model" className="text-gray-400 hover:text-green-500 transition-colors">
                    Collective vs Agency Model
                  </a>
                </li>
                <li>
                  <a href="/why-us" className="text-gray-400 hover:text-green-500 transition-colors">
                    Why Choose Us
                  </a>
                </li>
                <li>
                  <a href="/#services" className="text-gray-400 hover:text-green-500 transition-colors">
                    {t.ourServices}
                  </a>
                </li>
                <li>
                  <a href="/#results" className="text-gray-400 hover:text-green-500 transition-colors">
                    {t.caseStudies}
                  </a>
                </li>
                <li>
                  <a href="/results#testimonials" className="text-gray-400 hover:text-green-500 transition-colors ml-4">
                    → Client Testimonials
                  </a>
                </li>
                <li>
                  <a href="/results#brands" className="text-gray-400 hover:text-green-500 transition-colors ml-4">
                    → Brands We Work With
                  </a>
                </li>
                <li>
                  <a href="/#contact" className="text-gray-400 hover:text-green-500 transition-colors">
                    {t.contact}
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-green-500 transition-colors">
                    {t.privacyPolicy}
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-green-500 transition-colors">
                    {t.termsOfService}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-6">{t.getInTouch}</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-400">harry@superflycommerce.com</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 text-green-500 mr-3" />
                  <a href="https://wa.me/447969614703" className="text-gray-400 hover:text-green-500 transition-colors">
                    WhatsApp: +44 7969 614703
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-green-500 mr-3" />
                  <a href="https://calendly.com/superflycommerce" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                    Schedule Call via Calendly
                  </a>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-400">Globally-based, Remote-driven</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            {/* Charitable Impact - Small Version */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl p-6 max-w-4xl mx-auto">
                <h4 className="text-lg font-bold text-white mb-3">Your Growth Creates Impact</h4>
                <p className="text-green-100 text-sm mb-4">
                  10% of our profits go to environmental restoration and social impact projects.
                </p>
                <div className="flex justify-center space-x-8 text-xs">
                  <span className="text-green-200">🌱 Reforestation</span>
                  <span className="text-green-200">🎓 Education</span>
                  <span className="text-green-200">💧 Clean Water</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Superfly Commerce. {t.allRightsReserved}
              </p>
              <p className="text-gray-400 text-sm mt-4 md:mt-0">
                {t.sustainableGrowthTipsFooter}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;