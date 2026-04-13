import React from 'react';
import { TRANSLATIONS } from '../i18n/translations';

export type Language = 'en' | 'fr';

export type Phase = typeof TRANSLATIONS.en.phases[0];
export type Project = typeof TRANSLATIONS.en.projects[0];

export const LanguageContext = React.createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof TRANSLATIONS.en;
}>({
  lang: 'en',
  setLang: () => {},
  t: TRANSLATIONS.en
});
