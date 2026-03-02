import React from 'react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';
import { Users, Building, DollarSign, TrendingUp, Shield, Heart, CheckCircle, X, ArrowRight, Zap } from 'lucide-react';

const CollectiveModelPage = () => {
  const breadcrumbItems = [
    { label: 'About', href: '/#about' },
    { label: 'Collective Model', href: '/collective-model', current: true }
  ];

  const comparisons = [
    {
      category: "Fee Structure",
      collective: {
        title: "Performance-Based & Transparent",
        description: "Fees scale with your success. Clear pricing with sustainability rewards.",
        icon: TrendingUp,
        color: "text-green-600"
      },
      agency: {
        title: "Heavy Monthly Retainers",
        description: "Fixed high fees regardless of performance. Hidden markups and profit percentages.",
        icon: DollarSign,
        color: "text-red-600"
      }
    },
    {
      category: "Specialist Compensation",
      collective: {
        title: "Fair Pay for Specialists",
        description: "Specialists get paid what they're worth. No exploitation or unfair profit sharing.",
        icon: Heart,
        color: "text-green-600"
      },
      agency: {
        title: "Exploitative Markups",
        description: "Agencies take 50-70% margins. Specialists underpaid while clients overpay.",
        icon: Building,
        color: "text-red-600"
      }
    },
    {
      category: "Team Quality",
      collective: {
        title: "Vetted Amazon Specialists",
        description: "Hand-picked experts with proven Amazon track records. Direct access to specialists.",
        icon: Users,
        color: "text-green-600"
      },
      agency: {
        title: "Junior Staff on Senior Projects",
        description: "Junior employees doing senior-level work. Multiple layers between you and expertise.",
        icon: Building,
        color: "text-red-600"
      }
    },
    {
      category: "Sustainability Focus",
      collective: {
        title: "Rewards Green Practices",
        description: "Up to 40% discounts for sustainable businesses. 10% profits to environmental causes.",
        icon: Shield,
        color: "text-green-600"
      },
      agency: {
        title: "Profit-Only Focus",
        description: "No consideration for environmental impact. Pure profit maximization approach.",
        icon: DollarSign,
        color: "text-red-600"
      }
    }
  ];

  const collectiveAdvantages = [
    {
      icon: Zap,
      title: "No Agency Bloat",
      description: "Cut through heavy fees and bureaucracy. Direct access to specialists without middleman markups."
    },
    {
      icon: TrendingUp,
      title: "Performance Alignment",
      description: "Our success is tied to your success. We only win when you win - true partnership alignment."
    },
    {
      icon: Heart,
      title: "Ethical Standards",
      description: "Fair compensation for specialists, transparent pricing for clients, and charitable impact."
    },
    {
      icon: Shield,
      title: "Sustainability Rewards",
      description: "The more sustainable your business practices, the better pricing you receive."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Collective vs Agency
              <br />
              <span className="text-green-500">Why We're Different</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We're not an agency - we're a collective of Amazon specialists who believe in fair pay, 
              transparent pricing, and using business growth to create positive impact.
            </p>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Fundamental Difference</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Building className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Traditional Agency</h4>
                  <p className="text-sm text-gray-600">Profit extraction through markups and retainers</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Our Collective</h4>
                  <p className="text-sm text-gray-600">Value creation through specialist expertise</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Comparison */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Side-by-Side Comparison
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                See exactly how our collective model differs from traditional agencies
              </p>
            </div>

            <div className="space-y-12">
              {comparisons.map((comparison, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-3xl p-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                    {comparison.category}
                  </h3>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Our Collective */}
                    <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mr-4">
                          <comparison.collective.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-green-600 mb-1">OUR COLLECTIVE</div>
                          <h4 className="text-lg font-bold text-gray-900">
                            {comparison.collective.title}
                          </h4>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {comparison.collective.description}
                      </p>
                      <div className="mt-4 flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold text-sm">Better for everyone</span>
                      </div>
                    </div>

                    {/* Traditional Agency */}
                    <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mr-4">
                          <comparison.agency.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-red-600 mb-1">TRADITIONAL AGENCY</div>
                          <h4 className="text-lg font-bold text-gray-900">
                            {comparison.agency.title}
                          </h4>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {comparison.agency.description}
                      </p>
                      <div className="mt-4 flex items-center text-red-600">
                        <X className="w-5 h-5 mr-2" />
                        <span className="font-semibold text-sm">Exploitative model</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Our Collective Works */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Our Collective Model Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Built on principles of fairness, transparency, and mutual success
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {collectiveAdvantages.map((advantage, index) => (
                <div
                  key={index}
                  className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                    <advantage.icon className="w-8 h-8" />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-4">
                    {advantage.title}
                  </h4>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Real Impact */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Real Impact of Our Model
                </h2>
                <p className="text-lg text-gray-600">
                  See the tangible benefits of choosing our collective over traditional agencies
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-6 text-center shadow-md">
                  <div className="text-3xl font-bold text-green-500 mb-2">50-70%</div>
                  <div className="text-sm text-gray-600 mb-2">Cost Savings</div>
                  <p className="text-xs text-gray-500">vs traditional agency markups</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 text-center shadow-md">
                  <div className="text-3xl font-bold text-green-500 mb-2">100%</div>
                  <div className="text-sm text-gray-600 mb-2">Specialist Access</div>
                  <p className="text-xs text-gray-500">Direct communication with experts</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 text-center shadow-md">
                  <div className="text-3xl font-bold text-green-500 mb-2">10%</div>
                  <div className="text-sm text-gray-600 mb-2">Charitable Impact</div>
                  <p className="text-xs text-gray-500">Of profits to environmental causes</p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-gray-600 mb-6">
                  <strong>Example:</strong> A £2,000/month agency retainer becomes £800-1,200 with our collective, 
                  while specialists earn more and you get better results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Join Our Collective?
            </h2>
            
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Experience the difference of working with a collective that puts fairness, 
              transparency, and results first.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-full hover:bg-green-50 transition-colors font-semibold text-lg"
              >
                Book Discovery Call
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              
              <a
                href="/collective"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white hover:text-green-600 transition-colors font-semibold text-lg"
              >
                Meet Our Specialists
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CollectiveModelPage;