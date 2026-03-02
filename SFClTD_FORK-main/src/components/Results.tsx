import React from 'react';
import { Star, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useLanguage } from '../lib/languageContext';
import { useContent } from '../hooks/useContent';
import { QUERIES } from '../lib/sanity';

const Results = () => {
  const { t } = useLanguage();
  const { data: cmsData } = useContent<any>(QUERIES.RESULTS_PAGE);

  // Defaults
  const content = {
    title: cmsData?.title || "Real Results for Real Brands",
    subtitle: cmsData?.subtitle || "Proven growth for sustainable brands through strategic Amazon optimization.",
    testimonials: cmsData?.testimonials || [
      {
        name: "Miriam Rose",
        company: "Leon",
        image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
        result: "Amazon Compliance Fixed",
        text: "Superfly Commerce fixed our Amazon Vendor compliance issues. Their expertise was invaluable.",
        rating: 5
      }
    ],
    brands: cmsData?.brands || [
      { name: "Leon", logo: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200", url: "#" }
    ]
  };

  return (
    <section id="results" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {content.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Brands Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Brands We've Worked With</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {content.brands.map((brand: any, index: number) => (
              <a key={index} href={brand.url} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-center">
                <img src={brand.logo} alt={brand.name} className="max-h-12 opacity-60 group-hover:opacity-100 transition-opacity object-contain" />
              </a>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid lg:grid-cols-3 gap-8">
          {content.testimonials.map((testimonial: any, index: number) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                {testimonial.result}
              </div>
              <p className="text-gray-700 mb-8 italic">"{testimonial.text}"</p>
              <div className="flex items-center">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-green-600 font-medium">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Results;
