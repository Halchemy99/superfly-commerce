import React from 'react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';
import { Heart, CheckCircle, Users as Users2, Award } from 'lucide-react';
import { useLanguage } from '../lib/languageContext';

const WhyUsPage = () => {
  const { t } = useLanguage();
  
  const breadcrumbItems = [
    { label: 'About', href: '/#about' },
    { label: 'Why Choose Us', href: '/why-us', current: true }
  ];
  
  const values = [
    {
      icon: Heart,
      title: t.humanFirstApproach,
      description: "We put people at the center of everything we do, creating authentic connections between brands and customers."
    },
    {
      icon: CheckCircle,
      title: "Results-Driven",
      description: "Every strategy is built around measurable outcomes that directly impact your bottom line and growth."
    },
    {
      icon: Users2,
      title: "Custom Solutions",
      description: "No cookie-cutter approaches. We design tailored strategies that fit your unique brand and market position."
    },
    {
      icon: Award,
      title: "Proven Expertise",
      description: "Years of experience helping brands scale on TikTok and Amazon with strategies that actually work."
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
        <section className="py-20 bg-gradient-to-br from-green-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose
              <br />
              <span className="text-green-500">Superfly Commerce?</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              We're not just another marketing agency. We're your partners in building a sustainable, 
              profitable business that makes a positive impact on the world.
            </p>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                    <value.icon className="w-8 h-8" />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h4>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Benefits */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What Sets Us Apart
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainability-First</h3>
                <p className="text-gray-600">
                  We reward sustainable business practices with better pricing. The more sustainable you are, the less you pay.
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">No Long-Term Contracts</h3>
                <p className="text-gray-600">
                  Hop-on, hop-off model with no minimum commitment. Start or pause your subscription whenever you need.
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Transparent Pricing</h3>
                <p className="text-gray-600">
                  No hidden fees, no profit percentages. Clear, honest pricing that doesn't exploit our clients.
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Global Expertise</h3>
                <p className="text-gray-600">
                  Remote-first, globally-driven team with experience across multiple markets and cultures.
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ethical Standards</h3>
                <p className="text-gray-600">
                  We only work with brands that align with our values of sustainability and ethical business practices.
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Real Results</h3>
                <p className="text-gray-600">
                  300% average ROAS growth, £1M+ revenue generated, and 98% client satisfaction rate speak for themselves.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Work with Us?
            </h2>
            
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join the growing community of sustainable brands that are scaling profitably with Superfly Commerce.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pricing"
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-full hover:bg-green-50 transition-colors font-semibold text-lg"
              >
                View Our Pricing
              </a>
              
              <a
                href="/#contact"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white hover:text-green-600 transition-colors font-semibold text-lg"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default WhyUsPage;