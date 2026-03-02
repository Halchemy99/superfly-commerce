import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './lib/languageContext';
import { CurrencyProvider } from './lib/currencyContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Results from './components/Results';
import Contact from './components/Contact';

// Pages
import PricingPage from './pages/PricingPage';
import TikTokPage from './pages/TikTokPage';
import DocumentationHelpPage from './pages/DocumentationHelpPage';
import PhilosophyPage from './pages/PhilosophyPage';
import WhyUsPage from './pages/WhyUsPage';
import SustainabilityVerificationPage from './pages/SustainabilityVerificationPage';
import CollectivePage from './pages/CollectivePage';
import CollectiveModelPage from './pages/CollectiveModelPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './components/SuccessPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';

// The Homepage acts as a container for your main dynamic sections
const HomePage = () => (
  <>
    <Header />
    <main>
      <Hero />
      <Services />
      <About />
      <Contact />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Routes>
              {/* Marketing Pages (Content Managed by Sanity) */}
              <Route path="/" element={<HomePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/tiktok" element={<TikTokPage />} />
              <Route path="/results" element={<><Header /><Results /><Footer /></>} />
              <Route path="/documentation-help" element={<DocumentationHelpPage />} />
              <Route path="/philosophy" element={<PhilosophyPage />} />
              <Route path="/why-us" element={<WhyUsPage />} />
              <Route path="/collective" element={<CollectivePage />} />
              <Route path="/collective-model" element={<CollectiveModelPage />} />
              
              {/* Functional Pages (Managed by Code/Supabase) */}
              <Route path="/sustainability-verification" element={<SustainabilityVerificationPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/auth" element={<><Header /><AuthPage /><Footer /></>} />
              <Route path="/account" element={<><Header /><AccountPage /><Footer /></>} />
            </Routes>
          </div>
        </Router>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;
