import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  exchangeRates: { [key: string]: number };
  currencySymbols: { [key: string]: string };
  convertPrice: (gbpPrice: number) => number;
  formatPrice: (gbpPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState('GBP');
  
  const exchangeRates = {
    GBP: 1,
    USD: 1.27,
    EUR: 1.17,
    CNY: 9.1,
    AED: 4.67,
    JPY: 188.5
  };

  const currencySymbols = {
    GBP: '£',
    USD: '$',
    EUR: '€',
    CNY: '¥',
    AED: 'د.إ',
    JPY: '¥'
  };

  const convertPrice = (gbpPrice: number): number => {
    const rate = exchangeRates[currency as keyof typeof exchangeRates];
    return gbpPrice * rate;
  };

  const formatPrice = (gbpPrice: number): string => {
    const convertedPrice = convertPrice(gbpPrice);
    
    const formatOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'JPY' ? 0 : 0,
      maximumFractionDigits: currency === 'JPY' ? 0 : 0
    };
    
    const locales = {
      GBP: 'en-GB',
      USD: 'en-US', 
      EUR: 'de-DE',
      CNY: 'zh-CN',
      AED: 'ar-AE',
      JPY: 'ja-JP'
    };
    
    const locale = locales[currency as keyof typeof locales] || 'en-US';
    
    try {
      return new Intl.NumberFormat(locale, formatOptions).format(convertedPrice);
    } catch (error) {
      const symbol = currencySymbols[currency as keyof typeof currencySymbols];
      return `${symbol}${Math.round(convertedPrice)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      exchangeRates, 
      currencySymbols, 
      convertPrice, 
      formatPrice 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};