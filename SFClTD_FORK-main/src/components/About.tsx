import React from 'react';
import { Users, CheckCircle } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { QUERIES, urlFor } from '../lib/sanity';

const About = () => {
  const { data: cmsData } = useContent<any>(QUERIES.ABOUT);

  const content = {
    title: cmsData?.title || "We're Not an Agency.",
    subtitle: cmsData?.subtitle || "We're a Collective.",
    description: cmsData?.description || "We're Amazon specialists who cut through heavy agency fees with transparent, performance-based partnerships.",
    principles: cmsData?.principles || [
      "Global collective of Amazon specialists",
      "Performance-based retainers",
      "Transparent pricing with no hidden fees",
      "Sustainability discounts",
      "10% of profits donated"
    ],
    // If CMS image exists, convert it; otherwise use default
    imageUrl: cmsData?.image ? urlFor(cmsData.image) : "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800"
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                <Users className="w-4 h-4 mr-2" />
                Sustainable Amazon Collective
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {content.title} <br />
                <span className="text-green-500">{content.subtitle}</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {content.description}
              </p>
              <div className="space-y-4 mb-8">
                {content.principles.map((principle: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{principle}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={content.imageUrl}
                alt="Team"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
