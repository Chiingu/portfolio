import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export const LanguageSwitcher = React.memo(() => {
  const { lang, setLang } = useContext(LanguageContext);
  
  return (
    <div className="absolute top-4 right-4 md:top-8 md:right-8 z-[60] flex gap-2" role="radiogroup" aria-label="Language selector">
      <button 
        type="button"
        aria-label="Switch to English"
        aria-pressed={lang === 'en'}
        role="radio"
        aria-checked={lang === 'en'}
        onClick={() => setLang('en')}
        className={`text-[10px] md:text-xs px-2 py-1 border backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors ${lang === 'en' ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-white/20 text-white/40 hover:text-white hover:border-white/40'}`}
      >
        EN
      </button>
      <button 
        type="button"
        aria-label="Switch to French"
        aria-pressed={lang === 'fr'}
        role="radio"
        aria-checked={lang === 'fr'}
        onClick={() => setLang('fr')}
        className={`text-[10px] md:text-xs px-2 py-1 border backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors ${lang === 'fr' ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-white/20 text-white/40 hover:text-white hover:border-white/40'}`}
      >
        FR
      </button>
    </div>
  );
});
