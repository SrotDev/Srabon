import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [bengaliActive, setBengaliActive] = useState(
    localStorage.getItem('bengali_active') === 'true'
  );

  const toggleLanguage = () => {
    setBengaliActive(prev => {
      const newValue = !prev;
      localStorage.setItem('bengali_active', newValue);
      return newValue;
    });
  };

  // Keep it in sync with localStorage if changed outside
  useEffect(() => {
    const handleStorageChange = () => {
      setBengaliActive(localStorage.getItem('bengali_active') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <LanguageContext.Provider value={{ bengaliActive, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};


export default LanguageProvider