import React from 'react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';
import { ArrowRight, Play, Video, Users, Hash, BarChart3, CheckCircle, Heart } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { QUERIES } from '../lib/sanity';

// Icon mapper
const ICON_MAP: any = { Video, Users, Hash, BarChart3, Heart };

const TikTokPage = () => {
  const { data: cmsData } = useContent<any>(QUERIES.TIKTOK_PAGE);

  const content = {
    title: cmsData?.title || "Free TikTok Beta",
    subtitle: cmsData?.subtitle || "Worth £3,000",
    description: cmsData?.description || "Join us for 3 months of FREE TikTok management as we grow together.",
    heroImage: cmsData?.heroImage || "https://images.pexels.com/photos/7688374/pexels-photo-7688374.jpeg?auto=compress&cs=tinysrgb&w=800",
    features: cmsData?.features || [
      { title: "Content Strategy", description: "Sustainable brand storytelling", iconKey: "Video" },
      { title: "Influencer Partnerships", description: "Connect with ethical creators", iconKey: "Users" }
    ],
    principles: cmsData?.principles || [
      { title: "Beta Transparency", description: "Complete openness about our learning process." },
      { title: "Mutual Growth", description: "We grow skills, you grow sales." }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs items={[{ label: 'Services', href: '/#services' }, { label: 'TikTok', href: '/tiktok', current: true }]} />
        </div>

        {/* Dynamic Hero */}
        <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {content.title} <br />
                  <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    {content.subtitle}
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">{content.description}</p>
                <div className="flex gap-4">
                  <a href="#contact" className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                    Apply Now
                  </a>
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src={content.heroImage} alt="TikTok" className="w-full h-[600px] object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Principles */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Our Beta Approach</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {content.principles.map((p: any, idx: number) => (
                <div key={idx} className="text-center p-6 hover:bg-pink-50 rounded-2xl transition-colors">
                  <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">{p.title}</h4>
                  <p className="text-gray-600">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TikTokPage;
