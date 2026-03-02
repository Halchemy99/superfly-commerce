import React, { useState } from 'react';
import { Rocket, Users, TrendingUp, GraduationCap, ArrowRight, Star, Shield, CheckCircle, X } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { QUERIES } from '../lib/sanity';

// Map string keys from CMS to actual Lucide icons
const ICON_MAP: any = {
  Rocket, Users, TrendingUp, GraduationCap, Star, Shield
};

const Services = () => {
  const { data: cmsServices, loading } = useContent<any[]>(QUERIES.SERVICES);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // Fallback data if CMS is empty or loading
  const defaultServices = [
    {
      title: "Quick Win Packages",
      subtitle: "Fixed-Price Amazon Sprints",
      description: "Get immediate results with our proven Amazon optimization packages.",
      features: ["Listing Optimization Sprint", "A+ Content Package", "Brand Store Makeover"],
      iconKey: "Rocket",
      cta: "View Quick Wins",
      link: "/pricing",
      highlight: "Fixed Price • Fast Delivery",
      badge: "MOST POPULAR",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100 text-blue-600"
    },
    {
      title: "Expert Matching",
      subtitle: "Hand-Picked Specialists",
      description: "Get matched with vetted Amazon experts for complex projects.",
      features: ["Vetted specialist network", "Project scoping included"],
      iconKey: "Users",
      cta: "Meet Specialists",
      link: "/collective",
      highlight: "Vetted Experts • Quality Control",
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100 text-purple-600"
    }
  ];

  const services = (cmsServices && cmsServices.length > 0) ? cmsServices : defaultServices;

  const closeModal = () => setSelectedService(null);

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Four Ways to Grow <br />
            <span className="text-green-500">Your Amazon Business</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {services.map((service: any, index: number) => {
            const Icon = ICON_MAP[service.iconKey] || Rocket;
            
            return (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-gray-100 hover:border-green-300 cursor-pointer overflow-hidden"
                onClick={() => setSelectedService(index)}
              >
                {service.badge && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                    {service.badge}
                  </div>
                )}

                <div className="relative z-10">
                  <div className={`w-20 h-20 ${service.iconBg || 'bg-blue-100 text-blue-600'} rounded-3xl flex items-center justify-center mb-6`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-lg font-semibold text-green-600">{service.subtitle}</p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    {service.features && service.features.slice(0, 2).map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center text-gray-700 bg-green-50 rounded-xl p-3">
                        <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <button className="w-full inline-flex items-center justify-center text-white font-bold bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 text-lg">
                      {service.cta || "Learn More"}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedService !== null && services[selectedService] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={closeModal} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-3xl font-bold mb-4">{services[selectedService].title}</h3>
            <p className="text-gray-600 mb-6">{services[selectedService].description}</p>
            
            <div className="space-y-4">
              <h4 className="text-lg font-bold">Included Features:</h4>
              <ul className="space-y-2">
                {services[selectedService].features?.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 flex justify-end">
               <a href={services[selectedService].link || "/pricing"} className="px-8 py-3 bg-green-500 text-white rounded-xl font-bold">
                 Get Started
               </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
