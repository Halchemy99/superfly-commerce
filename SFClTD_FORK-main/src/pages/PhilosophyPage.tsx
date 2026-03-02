import React from 'react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';
import DoughnutEconomics from '../components/DoughnutEconomics';

const PhilosophyPage = () => {
  const breadcrumbItems = [
    { label: 'About', href: '/#about' },
    { label: 'Philosophy', href: '/philosophy', current: true }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <DoughnutEconomics />
      </main>
      <Footer />
    </div>
  );
};

export default PhilosophyPage;