import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'COP' | 'USD';
export type Language = 'es' | 'en';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  formatPrice: (priceInCOP: number) => string;
  convertPrice: (priceInCOP: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const COP_TO_USD_RATE = 0.00025; // 1 USD = 4,000 COP

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('dt_currency') as Currency) || 'COP';
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('dt_language') as Language) || 'es';
  });

  useEffect(() => {
    localStorage.setItem('dt_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('dt_language', language);
  }, [language]);

  const convertPrice = (priceInCOP: number): number => {
    if (currency === 'USD') {
      return Math.round((priceInCOP * COP_TO_USD_RATE) * 100) / 100;
    }
    return priceInCOP;
  };

  const formatPrice = (priceInCOP: number): string => {
    if (currency === 'USD') {
      const usdAmount = convertPrice(priceInCOP);
      return `$ ${usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    }
    return `$ ${priceInCOP.toLocaleString('es-CO')} COP`;
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      language,
      setLanguage,
      formatPrice,
      convertPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};
