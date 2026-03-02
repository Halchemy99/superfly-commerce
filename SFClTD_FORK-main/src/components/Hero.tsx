import React from 'react';
import { ArrowRight, Zap, Users, CheckCircle } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { QUERIES } from '../lib/sanity';

const Hero = () => {
  // Fetch data from Sanity
  const { data: cmsData } = useContent<any>(QUERIES.HOMEPAGE);

  // Use CMS data if available, otherwise use your original hardcoded defaults
  const content = {
    title: cmsData?.heroTitle || "Cut Through Heavy Fees. Get Results.",
    subtitle: cmsData?.heroSubtitle || "Sustainable Amazon Collective",
    description: cmsData?.heroDescription || "We're not an agency—we're a collective of Amazon specialists who believe in transparent pricing, performance-based partnerships, and cutting through the bloated retainer model.",
    stats: cmsData?.stats || [
      { value: "50+", label: "Global Specialists" },
      { value: "£1M+", label: "Revenue Driven" },
      { value: "10%", label: "Profits to Charity" }
    ]
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-green-500 via-green-600 to-green-700 overflow-hidden pt-20">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                <Users className="w-4 h-4 mr-2" />
                {content.subtitle}
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {content.title}
            </h1>
            
            <p className="text-xl text-green-50 mb-8 max-w-2xl">
              {content.description}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center text-green-100">
                <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                <span className="text-sm font-medium">No Heavy Retainers</span>
              </div>
              <div className="flex items-center text-green-100">
                <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                <span className="text-sm font-medium">Performance-Based</span>
              </div>
              <div className="flex items-center text-green-100">
                <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                <span className="text-sm font-medium">Sustainability Rewards</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#services" className="group inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-full hover:bg-green-50 transition-all duration-300 font-semibold text-lg transform hover:scale-105 shadow-lg">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/pricing" className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white rounded-full hover:border-white hover:bg-white/10 transition-all duration-300 font-semibold text-lg backdrop-blur-sm">
                <Zap className="mr-2 w-5 h-5" />
                View Pricing
              </a>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-8 text-center lg:text-left">
              {content.stats.map((stat: any, idx: number) => (
                <div key={idx}>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-green-100 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
             {/* Visuals can stay static or be fetched if needed */}
             <div className="w-96 h-96 mx-auto relative">
                <div className="absolute inset-0 border-[24px] border-white/30 rounded-full"></div>
                <div className="absolute inset-6 border-[20px] border-white/50 rounded-full bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute inset-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/40">
                  <div className="text-center">
                    <div className="text-4xl font-black text-white mb-2">AMAZON</div>
                    <div className="text-2xl font-bold text-green-200 mb-1">GROWTH</div>
                    <div className="text-sm font-semibold text-white/90">Sustainable & Fair</div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
