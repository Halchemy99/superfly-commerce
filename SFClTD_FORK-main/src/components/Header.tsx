import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, Settings, Users, Lightbulb, CreditCard, TrendingUp, ShoppingCart, LogIn, User } from 'lucide-react'; // --- IMPORT LogIn, User ---
import { useLanguage } from '../lib/languageContext';
import { useCurrency } from '../lib/currencyContext';
import LanguageSelector from './LanguageSelector';
import { supabase } from '../lib/supabase.ts'; // --- IMPORT supabase ---
import type { Session } from '@supabase/supabase-js'; // --- IMPORT Session ---

const Header = () => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOnHomepage, setIsOnHomepage] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState(0);
  const [session, setSession] = useState<Session | null>(null); // --- ADD SESSION STATE ---

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    // Check if we're on homepage
    setIsOnHomepage(window.location.pathname === '/');
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- ADD SUPABASE AUTH LISTENER ---
  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // Listen for cart updates from localStorage or context
  useEffect(() => {
    const updateCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem('superflyCart');
        if (savedCart) {
          const cart = JSON.parse(savedCart);
          const total = cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
          const itemCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
          setCartTotal(total);
          setCartItems(itemCount);
        } else {
          setCartTotal(0);
          setCartItems(0);
        }
      } catch (error) {
        setCartTotal(0);
        setCartItems(0);
      }
    };

    // Initial load
    updateCartFromStorage();

    // Listen for storage changes
    window.addEventListener('storage', updateCartFromStorage);
    
    // Listen for custom cart update events
    window.addEventListener('cartUpdated', updateCartFromStorage);

    return () => {
      window.removeEventListener('storage', updateCartFromStorage);
      window.removeEventListener('cartUpdated', updateCartFromStorage);
    };
  }, []);
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || !isOnHomepage ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img 
                src="/SFC COMMERCE (4).png" 
                alt="Superfly Commerce Logo" 
               className="h-20 object-contain transition-all duration-300"
               style={{
                 filter: isScrolled || !isOnHomepage 
                   ? 'brightness(0) saturate(100%) invert(69%) sepia(89%) saturate(2267%) hue-rotate(100deg) brightness(97%) contrast(86%)' 
                  : 'none'
               }}
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 ml-8">
              <a href="/#services" className={`flex items-center space-x-2 hover:text-green-500 transition-all duration-300 font-medium group ${
                isScrolled || !isOnHomepage ? 'text-gray-700' : 'text-white'
              }`}>
                <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span>{t.services}</span>
              </a>
              <a href="/#about" className={`flex items-center space-x-2 hover:text-green-500 transition-all duration-300 font-medium group ${
                isScrolled || !isOnHomepage ? 'text-gray-700' : 'text-white'
              }`}>
                <Users className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span>{t.about}</span>
              </a>
              <a href="/philosophy" className={`flex items-center space-x-2 hover:text-green-500 transition-all duration-300 font-medium group ${
                isScrolled || !isOnHomepage ? 'text-gray-700' : 'text-white'
              }`}>
                <Lightbulb className="w-4 h-4 group-hover:animate-pulse transition-all duration-300" />
                <span>Philosophy</span>
              </a>
              <a href="/pricing" className={`flex items-center space-x-2 hover:text-green-500 transition-all duration-300 font-medium group ${
                isScrolled || !isOnHomepage ? 'text-gray-700' : 'text-white'
              }`}>
                <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span>Pricing</span>
              </a>
              <LanguageSelector />
              <a href="/#contact" className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors font-medium">
                Book Discovery Call
              </a>
              <a href="/tiktok" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-colors font-medium flex items-center">
                <div className="w-4 h-4 mr-2 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                TikTok
              </a>
            </nav>

            {/* Cart Icon & Auth Link - Far Right */}
            <div className="hidden md:flex items-center ml-4 space-x-6">
              {/* --- AUTH LINK --- */}
              {session ? (
                <a href="/account" className={`flex items-center space-x-2 hover:text-green-500 transition-all duration-300 font-medium group ${
                  isScrolled || !isOnHomepage ? 'text-gray-700' : 'text-white'
                }`}>
                  <User className="w-5 h-5" />
                  <span>Account</span>
                </a>
              ) : (
                <a href="/auth" className={`flex items-center space-x-2 hover:text-green-500 transition-all duration-300 font-medium group ${
                  isScrolled || !isOnHomepage ? 'text-gray-700' : 'text-white'
                }`}>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </a>
              )}
            
              {/* Cart */}
              <a href="/checkout" className={`relative flex items-center space-x-2 hover:text-green-500 transition-all duration-300 font-medium group ${
                isScrolled || !isOnHomepage ? 'text-gray-700' : 'text-white'
              }`}>
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  {cartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                      {cartItems > 99 ? '99+' : cartItems}
                    </span>
                  )}
                </div>
                {cartTotal > 0 && (
                  <span className="text-sm font-semibold bg-green-500 text-white px-2 py-1 rounded-full">
                    {formatPrice(cartTotal)}
                  </span>
                )}
              </a>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-md hover:text-green-500 transition-colors ${
                isScrolled || !isOnHomepage ? 'text-gray-700' : 'text-white'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* --- MOBILE AUTH LINK --- */}
              {session ? (
                <a
                  href="/account"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-green-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </a>
              ) : (
                <a
                  href="/auth"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-green-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Sign Up</span>
                </a>
              )}

              <a
                href="/#services"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-green-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4" />
                <span>{t.services}</span>
              </a>
              <a
                href="/#about"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-green-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Users className="w-4 h-4" />
                <span>{t.about}</span>
              </a>
              <a
                href="/philosophy"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-green-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Lightbulb className="w-4 h-4" />
                <span>Philosophy</span>
              </a>
              <a
                href="/pricing"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-green-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <CreditCard className="w-4 h-4" />
                <span>Pricing</span>
              </a>
              <div className="px-3 py-2">
                {/* Mobile Cart Icon */}
                <a
                  href="/checkout"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-green-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="relative">
                    <ShoppingCart className="w-4 h-4" />
                    {cartItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold animate-pulse">
                        {cartItems > 99 ? '99+' : cartItems}
                      </span>
                    )}
                  </div>
                  <span>Checkout {cartTotal > 0 && `- ${formatPrice(cartTotal)}`}</span>
                </a>
              </div>
              <div className="px-3 py-2">
                <LanguageSelector />
              </div>
              <a
                href="/#contact"
                className="block px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-center"
                onClick={() => setIsOpen(false)}
              >
                Book Discovery Call
              </a>
            </div>
          </div>
        )}
      </>
    </header>
  );
};

export default Header;
