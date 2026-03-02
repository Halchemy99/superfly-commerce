import React from 'react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';
import { Star, Award, TrendingUp, Users, CheckCircle, MessageCircle, Mail } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { QUERIES, urlFor } from '../lib/sanity';

const CollectivePage = () => {
  const breadcrumbItems = [
    { label: 'About', href: '/#about' },
    { label: 'Meet Our Collective', href: '/collective', current: true }
  ];

  const { data: specialists } = useContent<any[]>(QUERIES.SPECIALISTS);

  // Fallback data (Your original hardcoded specialists)
  const defaultSpecialists = [
    {
      _id: 1,
      name: "Sarah",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
      specialties: ["Amazon PPC", "Campaign Optimization"],
      budgetRange: "£500-2000/month",
      experience: "5+ years",
      strengths: ["Data-driven approach", "ROI optimization"],
      pros: ["Excellent at reducing ACoS", "Quick setup"],
      cons: ["Prefers larger budgets"],
      services: ["PPC Campaign Management", "Keyword Strategy"],
      rating: 4.9,
      completedProjects: 47
    },
    // ... add other default specialists here if desired
  ];

  const displaySpecialists = (specialists && specialists.length > 0) ? specialists : defaultSpecialists;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Collective <br />
              <span className="text-green-500">Amazon-Focused Specialists</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Hand-picked Amazon experts for specific budgets and needs.
            </p>
          </div>
        </section>

        {/* Specialists Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displaySpecialists.map((specialist: any) => (
                <div key={specialist._id} className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-green-300">
                  {/* Avatar */}
                  <div className="text-center mb-6">
                    <img
                      src={specialist.avatar || "https://via.placeholder.com/150"}
                      alt={specialist.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover ring-4 ring-green-100"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{specialist.name}</h3>
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-700">
                        {specialist.rating} ({specialist.completedProjects} projects)
                      </span>
                    </div>
                    <div className="text-sm text-green-600 font-medium">{specialist.budgetRange}</div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {specialist.specialties?.map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Pros & Cons */}
                  <div className="mb-6 space-y-3">
                    <div>
                      <h5 className="text-xs font-bold text-green-600 uppercase mb-1">Pros</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {specialist.pros?.slice(0, 2).map((pro: string, i: number) => (
                          <li key={i} className="flex items-start"><CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" /> {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-orange-600 uppercase mb-1">Considerations</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {specialist.cons?.slice(0, 1).map((con: string, i: number) => (
                          <li key={i} className="flex items-start"><div className="w-3 h-3 border border-orange-400 rounded-full mr-1 flex-shrink-0"></div> {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a href="#contact" className="w-full flex items-center justify-center py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Get Connected
                  </a>
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

export default CollectivePage;
