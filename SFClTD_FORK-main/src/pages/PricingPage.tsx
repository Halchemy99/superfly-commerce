import React from 'react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

const PricingPage = () => {
  const breadcrumbItems = [
    { label: 'Services', href: '/#services' },
    { label: 'Pricing', href: '/pricing', current: true }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;