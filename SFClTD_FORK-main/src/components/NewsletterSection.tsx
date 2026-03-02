import React from 'react';
import { Sparkles, Mail, TrendingUp, Zap } from 'lucide-react';

const NewsletterSection = () => {
  return (
    <section className="bg-gradient-to-r from-gray-900 via-green-900 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-20 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-4 right-20 w-40 h-40 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-8 right-1/3 w-24 h-24 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Content */}
          <div>
            <div className="flex items-center mb-4">
              <Sparkles className="w-8 h-8 text-green-400 mr-3 animate-pulse" />
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Stay in the Loop!
              </h2>
            </div>
            
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              Get exclusive Amazon growth tips, sustainability insights, and industry updates delivered to your inbox.
            </p>
            
            {/* Benefits */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center text-green-300">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>Sustainable growth tips</span>
              </div>
              <div className="flex items-center text-green-300">
                <Zap className="w-4 h-4 mr-2" />
                <span>Amazon insights</span>
              </div>
              <div className="flex items-center text-green-300">
                <Mail className="w-4 h-4 mr-2" />
                <span>No spam, just value</span>
              </div>
            </div>
          </div>

          {/* Right Side - Newsletter Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">
              Enter your email for growth tips
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-white placeholder-gray-400 backdrop-blur-sm"
                />
              </div>
              <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap">
                Join Now
              </button>
            </div>
            
            <p className="text-xs text-gray-400 mt-3 flex items-center justify-center sm:justify-start">
              <span className="mr-2">🌱</span>
              Sustainable growth tips • 
              <span className="mx-1">📈</span>
              Amazon insights • 
              <span className="mx-1">🚀</span>
              No spam, just value
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;