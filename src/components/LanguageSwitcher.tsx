import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export const LanguageSwitcher = React.memo(() => {
  const { lang, setLang } = useContext(LanguageContext);
  
  return (
    <div className="absolute top-4 right-4 md:top-8 md:right-8 z-[60] flex gap-2">
      <button 
        aria-label="Switch to English"
        onClick={() => setLang('en')}
        className={`text-[10px] md:text-xs px-2 py-1 border transition-colors ${lang === 'en' ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-white/20 text-white/40 hover:text-white hover:border-white/40'}`}
      >
        EN
      </button>
      <button 
        aria-label="Switch to French"
        onClick={() => setLang('fr')}
        className={`text-[10px] md:text-xs px-2 py-1 border transition-colors ${lang === 'fr' ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-white/20 text-white/40 hover:text-white hover:border-white/40'}`}
      >
        FR
      </button>
    </div>
  );
});
