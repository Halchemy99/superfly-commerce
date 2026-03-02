import React from 'react';
import { Globe, Heart, Shield, Users, TrendingUp } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { QUERIES } from '../lib/sanity';

const ICON_MAP: any = { Globe, Heart, Shield, Users, TrendingUp };

const DoughnutEconomics = () => {
  const { data: cmsData } = useContent<any>(QUERIES.PHILOSOPHY_PAGE);

  const content = {
    title: cmsData?.title || "Doughnut Economics",
    subtitle: cmsData?.subtitle || "In Action",
    description: cmsData?.description || "We operate within the safe and just operating space for humanity.",
    principles: cmsData?.principles || [
      { title: "Planetary Boundaries", description: "Operating within Earth's ecological limits.", iconKey: "Globe" },
      { title: "Social Foundation", description: "Ensuring fair compensation for all.", iconKey: "Users" }
    ]
  };

  return (
    <section id="doughnut-economics" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {content.title} <br />
            <span className="text-green-500">{content.subtitle}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Principles Grid */}
          <div className="space-y-6">
            {content.principles.map((p: any, idx: number) => {
              const Icon = ICON_MAP[p.iconKey] || Globe;
              return (
                <div key={idx} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h4>
                    <p className="text-gray-600">{p.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Visual Graphic (Static for now) */}
          <div className="relative flex items-center justify-center">
             <div className="w-80 h-80 border-8 border-green-400 rounded-full flex items-center justify-center bg-green-50">
               <span className="text-green-700 font-bold">Safe & Just Space</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoughnutEconomics;
