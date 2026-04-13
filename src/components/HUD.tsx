import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import barcodeBars from '../assets/barcode-bars.svg';

const TIME_FORMATTERS = {
  en: new Intl.DateTimeFormat('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
  fr: new Intl.DateTimeFormat('fr-FR', { hour12: false, hour: '2-digit', minute: '2-digit' }),
};

const DATE_FORMATTERS = {
  en: new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long' }),
  fr: new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
};

export const Clock = React.memo(() => {
  const { lang } = useContext(LanguageContext);
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const localeKey = lang === 'fr' ? 'fr' : 'en';

  return (
    <div className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-col items-start z-50">
      <div className="text-[clamp(2rem,5vw,3.75rem)] font-light tracking-widest leading-none">{TIME_FORMATTERS[localeKey].format(time)}</div>
      <div className="text-[clamp(0.7rem,1.5vw,0.875rem)] mt-2 text-white/60 uppercase">{DATE_FORMATTERS[localeKey].format(time)}</div>
    </div>
  );
});

export const NodeInfo = React.memo(() => (
  <div className="absolute top-16 right-4 md:top-20 md:right-8 text-right text-[10px] md:text-xs z-50 hidden sm:block" aria-hidden="true">
    <div className="flex justify-between w-32 md:w-48 border-b border-white/30 pb-1 mb-1 text-white/40">
      <span>CPU</span><span>NODE</span>
    </div>
    <div className="flex justify-between w-32 md:w-48">
      <span>Workstation</span><span>109.30.81.31</span>
    </div>
  </div>
));

export const TerminalLogs = React.memo(() => {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const initialLogs = [
      '> BEGIN_LINK_ESTABLISHED - AU-3087H-INST-2',
      '> LOG_STREAM_CONNECTED // ID75252N-A698-4D95-A85D-E231A45F13F',
      '> WL_OUTPUT_PROBE: UP 1 ==> ADDR_PIN: 0xF3A56B81',
      '------------------ SYSTEM_OS_INITIALIZING ------------------',
      '> [MB_IDP] Using Protocol::TEST',
      '> [ROUTING] [ CIPHER_NEGOTIATED ==> SHA3(256)@0xAF1B-16A]',
      '> [MB_IDP] Opened session for user(system)'
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < initialLogs.length) {
        setLogs(prev => [...prev, initialLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-[8px] md:text-[10px] text-white/60 font-mono w-2/3 md:w-1/3 z-50 hidden sm:block" aria-hidden="true">
      {logs.map((log, i) => (
        <div key={i} className="mb-1">{log}</div>
      ))}
      <div className="mt-2 border border-white/20 p-1 inline-block">
        MBOUIZAK ver=13.37 <span className="text-white">v UM6.P</span>
      </div>
    </div>
  );
});

export const RightBarcode = React.memo(() => {
  const [hex, setHex] = useState('');
  
  useEffect(() => {
    const generateHex = () => {
      let result = '';
      const chars = '0123456789ABCDEF';
      for (let i = 0; i < 40; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    setHex(generateHex());
    const interval = setInterval(() => setHex(generateHex()), 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute right-2 md:right-4 top-1/4 bottom-1/4 w-6 md:w-8 flex flex-col items-center justify-between text-[6px] md:text-[8px] z-50 hidden sm:flex" aria-hidden="true">
      <div className="writing-vertical-rl tracking-widest opacity-50">
        A0080B119-CF9A-4E8D-A85D-E231A45F13F-00-00-001
      </div>
      <div className="flex-1 w-full my-4 flex flex-col justify-center gap-1 opacity-40">
        <img src={barcodeBars} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="writing-vertical-rl tracking-widest font-bold text-cyan-500/50">
        {hex}
      </div>
    </div>
  );
});
