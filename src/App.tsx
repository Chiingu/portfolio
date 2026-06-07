import React, { Suspense, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { User, Terminal as TerminalIcon, Cpu, Server, Box, Zap, Database, Wifi, Activity, Github, Linkedin, FileDown } from 'lucide-react';

import { LanguageContext, Language } from './context/LanguageContext';
import { TRANSLATIONS } from './i18n/translations';

import { NetworkBackground } from './components/NetworkBackground';
import { MbLogo } from './components/MbLogo';
import { Clock, NodeInfo, TerminalLogs, RightBarcode } from './components/HUD';
import { LanguageSwitcher } from './components/LanguageSwitcher';

import scanlineOverlay from './assets/scanline-overlay.svg';
import cornerTl from './assets/corner-tl.svg';
import cornerTr from './assets/corner-tr.svg';
import cornerBl from './assets/corner-bl.svg';
import cornerBr from './assets/corner-br.svg';

const SKILLS = [
  { n: 'C/C++', i: Cpu, lvl: 90 },
  { n: 'DOCKER', i: Server, lvl: 85 },
  { n: 'RUST', i: Zap, lvl: 60 },
  { n: 'BASH', i: TerminalIcon, lvl: 80 },
  { n: 'REACT', i: Box, lvl: 75 },
  { n: 'POSTGRES', i: Database, lvl: 70 },
  { n: 'GO', i: Wifi, lvl: 65 },
  { n: 'ASM', i: Activity, lvl: 50 },
] as const;

const LOADING_SEGMENTS = Array.from({ length: 20 });



function AppContent() {
  const { t, lang } = useContext(LanguageContext);
  const shouldReduceMotion = useReducedMotion();
  // States: 'idle', 'verified', 'system'
  const [systemState, setSystemState] = useState<'idle' | 'verified' | 'system'>('idle');
  const [progress, setProgress] = useState(0);

  const [hacked, setHacked] = useState(false);

  useEffect(() => {
    let keys = '';
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent triggering when typing in the terminal or other inputs
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      keys = (keys + e.key).slice(-10).toLowerCase();
      if (keys.includes('hack') || keys.includes('sudo')) {
        setHacked(true);
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setHacked(false), 2500);
        keys = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleLogin = () => {
    setProgress(0);
    setSystemState('verified');
  };

  const handleDownloadCv = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const url = lang === 'fr' ? '/cv-fr.pdf' : '/cv-en.pdf';
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = lang === 'fr' ? 'cv-fr.pdf' : 'cv-en.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed', err);
    }
  }, [lang]);

  useEffect(() => {
    if (systemState !== 'verified') {
      return;
    }

    if (shouldReduceMotion) {
      setProgress(100);
      const timeout = setTimeout(() => setSystemState('system'), 120);
      return () => clearTimeout(timeout);
    }

    const durationMs = 2200;
    let animationFrameId = 0;
    let completeTimeout: ReturnType<typeof setTimeout> | undefined;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / durationMs);
      // Ease-out to make the loading feel less mechanical.
      const eased = 1 - (1 - ratio) * (1 - ratio);
      setProgress(Math.round(eased * 100));

      if (ratio < 1) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        completeTimeout = setTimeout(() => setSystemState('system'), 280);
      }
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (completeTimeout) {
        clearTimeout(completeTimeout);
      }
    };
  }, [systemState, shouldReduceMotion]);

  return (
    <div className="min-h-screen bg-transparent text-white font-mono relative overflow-hidden" aria-busy={systemState === 'verified'}>
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.14),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.1),transparent_52%)]" />
      {hacked && (
        <div className="fixed inset-0 bg-red-600/40 z-[9999] pointer-events-none flex items-center justify-center mix-blend-color-burn animate-pulse">
          <h1 className="text-5xl md:text-9xl font-bold text-red-500 tracking-tighter animate-glitch-1">BREACH DETECTED</h1>
        </div>
      )}
      <NetworkBackground faded={systemState === 'system'} />
      
      {/* Persistent Overlay Elements */}
      <AnimatePresence>
        {(systemState === 'idle' || systemState === 'verified') && (
          <motion.div
            key="hud"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.05, filter: shouldReduceMotion ? 'none' : 'blur(10px)' }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 pointer-events-none z-50"
          >
            <Clock />
            <NodeInfo />
            <TerminalLogs />
            <RightBarcode />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center z-40">
        <AnimatePresence mode="wait">
          
          {/* STATE: AUTH FLOW (IDLE & VERIFIED) */}
          {(systemState === 'idle' || systemState === 'verified') ? (
            <motion.div 
              key="auth-flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center"
            >
              {/* Title Area */}
              <div className="h-16 flex items-end justify-center mb-8">
                <AnimatePresence>
                  {systemState === 'verified' && (
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0.15 : 0.35 }}
                      className="text-2xl tracking-[0.3em]"
                    >
                      {t.ui.identityVerified}
                    </motion.h2>
                  )}
                </AnimatePresence>
              </div>

              {/* Main Panel (Logo -> ID Card) */}
              <motion.div 
                layout
                transition={{ duration: shouldReduceMotion ? 0.15 : 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`relative overflow-hidden border ${systemState === 'idle' ? 'w-[180px] h-[60px] border-transparent mb-8' : 'w-[92vw] max-w-[32rem] min-h-[12rem] sm:h-56 border-white/20 bg-black/55 backdrop-blur-md mb-8 rounded-md'}`}
              >
                <AnimatePresence>
                  {systemState === 'idle' ? (
                    <motion.div 
                      key="logo"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <MbLogo />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="card"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="absolute inset-0 p-5 sm:p-8 flex items-center gap-5 sm:gap-8"
                    >
                      <img src={cornerTl} alt="" className="absolute top-0 left-0 w-4 h-4" />
                      <img src={cornerTr} alt="" className="absolute top-0 right-0 w-4 h-4" />
                      <img src={cornerBl} alt="" className="absolute bottom-0 left-0 w-4 h-4" />
                      <img src={cornerBr} alt="" className="absolute bottom-0 right-0 w-4 h-4" />
                      
                      <div className="flex-1 flex flex-col justify-between h-full relative z-10">
                        <div className="flex justify-between border-b border-white/20 pb-3">
                          <div>
                            <div className="text-[8px] sm:text-[10px] text-white/40 tracking-widest mb-1">{t.ui.deptId}</div>
                            <motion.div layoutId="dept-id" transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-[clamp(0.6rem,2.5vw,0.875rem)] sm:text-sm font-bold tracking-widest text-red-500 whitespace-nowrap">{t.ui.digitalArchitect}</motion.div>
                          </div>
                          <div className="text-right">
                            <div className="text-[8px] sm:text-[10px] text-white/40 tracking-widest mb-1">{t.ui.class}</div>
                            <motion.div layoutId="class-id" transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-sm sm:text-base font-bold tracking-widest text-cyan-400">1337_Rabat</motion.div>
                          </div>
                        </div>
                        
                        <div className="my-auto">
                          <div className="text-[8px] sm:text-[10px] text-white/40 tracking-widest mb-1">{t.ui.fullName}</div>
                          <motion.div layoutId="full-name" transition={{ duration: shouldReduceMotion ? 0.15 : 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-[clamp(0.9rem,4vw,1.25rem)] sm:text-xl tracking-[0.05em] sm:tracking-[0.2em] leading-none uppercase break-words pr-2">MOURTADA BOUIZAKARNE</motion.div>
                        </div>

                        <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white/20 flex flex-col justify-between p-1.5">
                              <div className="h-[2px] bg-white/80 w-full"></div>
                              <div className="h-[2px] bg-white/80 w-3/4"></div>
                              <div className="h-[2px] bg-white/80 w-1/2"></div>
                              <div className="h-[2px] bg-white/80 w-full"></div>
                            </div>
                            <div className="text-[8px] sm:text-[10px] tracking-widest text-white/60 font-mono">
                              7524129823004A
                            </div>
                          </div>
                          <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                        </div>
                      </div>
                      
                      <motion.div layoutId="profile-pic" transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="w-24 h-32 sm:w-32 sm:h-40 shrink-0 border border-white/20 bg-black flex items-center justify-center relative z-10 overflow-hidden group">
                        <User className="text-white/20 w-12 h-12 sm:w-16 sm:h-16 absolute z-0" />
                        <img 
                          src="/profile.png" 
                          alt="Profile" 
                          className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-[1.4] brightness-75 mix-blend-luminosity opacity-90 group-hover:opacity-100 group-hover:contrast-[1.6] transition-all duration-500 z-10"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        
                        {/* Hacker Aesthetic Overlays */}
                        <div
                          className="absolute inset-0 opacity-50 mix-blend-overlay pointer-events-none z-20"
                          style={{ backgroundImage: `url(${scanlineOverlay})` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-cyan-500/20 mix-blend-color pointer-events-none z-20"></div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-b from-transparent via-red-500/10 to-transparent animate-scan z-20"></div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Action Panel (Login Button -> Loading Bar) */}
              <motion.div 
                layout
                transition={{ duration: shouldReduceMotion ? 0.15 : 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`relative ${systemState === 'idle' ? 'w-64 sm:w-80 h-14 border border-white/30 p-1' : 'w-[90vw] max-w-[500px] h-4'}`}
              >
                <AnimatePresence>
                  {systemState === 'idle' ? (
                    <motion.div 
                      key="login-btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <div className="absolute -top-3 left-2 bg-black px-1 text-[10px] text-white/60">NetPath::SYSTEM</div>
                      <div className="h-full flex items-center justify-center p-1">
                        <button 
                          type="button"
                          onClick={handleLogin}
                          className="w-full h-full bg-white text-black font-bold hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors"
                        >
                          {t.ui.login}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="loading-bar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="absolute inset-0 flex gap-1"
                      role="progressbar"
                      aria-label={t.ui.enteringSystem}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progress}
                    >
                      {LOADING_SEGMENTS.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-full flex-1 ${i < (progress / 5) ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-white/10'}`}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Footer Text */}
              <div className="h-16 flex items-start mt-12">
                <AnimatePresence>
                  {systemState === 'idle' && (
                    <motion.div 
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-4 text-[10px] text-white/40 max-w-xs"
                    >
                      <div className="w-4 h-4 border border-white/40 flex-shrink-0 mt-0.5"></div>
                      <p>{t.ui.footerText}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : systemState === 'system' ? (
            <motion.main
              key="system"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 overflow-y-auto pt-20 pb-20 px-6 md:pt-32 md:px-16 z-30"
              id="main-content"
            >

              <div className="max-w-7xl mx-auto space-y-24 md:space-y-32">
                
                {/* HEADER */}
                <header className="border-b border-white/20 pb-8 flex flex-col-reverse md:flex-row justify-between items-start gap-8 md:gap-12">
                  <div className="w-full md:w-2/3 flex flex-col">
                    <motion.h1 layoutId="full-name" transition={{ duration: shouldReduceMotion ? 0.15 : 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-[clamp(1.2rem,4.5vw,3.5rem)] tracking-[0.05em] sm:tracking-[0.2em] mb-6 leading-none transition-all uppercase break-words">
                      MOURTADA BOUIZAKARNE
                    </motion.h1>
                    
                    <div className="border-l-2 border-red-500/50 pl-4 py-1 mb-8">
                      <p className="text-white/70 leading-relaxed text-[clamp(0.875rem,1.5vw,1rem)] font-mono">
                        {t.ui.aboutMePart1}<motion.span layoutId="dept-id" transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-red-400 font-bold inline-block whitespace-nowrap">{t.ui.digitalArchitect}</motion.span>{t.ui.aboutMePart2}<motion.span layoutId="class-id" transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-cyan-400 font-bold inline-block">1337_Rabat</motion.span>{t.ui.aboutMePart3}
                      </p>
                    </div>

                    {/* CONTACTS & CV */}
                    <div className="flex flex-wrap items-center gap-3">
                      <a href="https://github.com/Chiingu" target="_blank" rel="noreferrer noopener" aria-label="GitHub profile" className="border border-white/20 bg-black/50 hover:border-red-500/50 hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-all px-3 py-2 flex items-center gap-2">
                        <Github size={16} />
                        <span className="text-[10px] tracking-widest hidden sm:block">{t.ui.github}</span>
                      </a>
                      <a href="https://www.linkedin.com/in/mourtada-bouizakarne/" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn profile" className="border border-white/20 bg-black/50 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white/60 hover:text-cyan-400 transition-all px-3 py-2 flex items-center gap-2">
                        <Linkedin size={16} />
                        <span className="text-[10px] tracking-widest hidden sm:block">{t.ui.linkedin}</span>
                      </a>

                      
                      <button 
                        type="button"
                        onClick={handleDownloadCv}
                        aria-label="Download CV"
                        className="border border-cyan-500/30 bg-cyan-500/10 hover:border-cyan-400 hover:bg-cyan-400/20 text-cyan-400 transition-all px-4 py-2 flex items-center gap-2 cursor-pointer"
                      >
                        <FileDown size={16} />
                        <span className="text-[10px] tracking-widest">{t.ui.downloadCv}</span>
                      </button>
                    </div>
                  </div>

                  <motion.div layoutId="profile-pic" transition={{ duration: shouldReduceMotion ? 0.15 : 0.8, ease: [0.16, 1, 0.3, 1] }} className="w-32 h-40 md:w-48 md:h-64 shrink-0 border border-white/20 bg-black flex items-center justify-center relative z-10 overflow-hidden self-center md:self-start">
                    <User className="text-white/20 w-16 h-16 md:w-24 md:h-24 absolute z-0" />
                    <img 
                      src="/profile.png" 
                      alt="Profile" 
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-[1.4] brightness-75 mix-blend-luminosity opacity-90 transition-all duration-500 z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-50 mix-blend-overlay pointer-events-none z-20"
                      style={{ backgroundImage: `url(${scanlineOverlay})` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-cyan-500/20 mix-blend-color pointer-events-none z-20"></div>
                  </motion.div>
                </header>

                {/* DOSSIER */}
                <section>
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-2 h-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                    <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] tracking-widest text-white/90">{t.ui.dossierRecords}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 to-transparent"></div>
                  </div>
                  
                  <div className="flex flex-col gap-12 relative">
                    {/* Vertical connecting line */}
                    <div className="absolute left-4 top-4 bottom-4 w-px bg-white/10 hidden md:block"></div>

                    {t.phases.map((phase, i) => (
                      <motion.div 
                        key={i} 
                        initial={shouldReduceMotion ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 50, x: -20 }}
                        whileInView={{ opacity: 1, y: 0, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, ease: 'easeOut' }}
                        className="relative md:pl-16"
                      >
                        {/* Timeline Node */}
                        <div className="absolute left-[11px] top-6 w-3 h-3 rounded-full bg-black border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] hidden md:block z-10"></div>
                        
                        <div className="group relative bg-black/40 border border-white/10 p-6 md:p-8 hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
                          {/* Background Glow */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-red-500/0 group-hover:from-cyan-500/5 group-hover:via-transparent group-hover:to-red-500/5 blur-xl transition-all duration-500"></div>
                          
                          <div className="relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-white/10 pb-4">
                              <div>
                                <h3 className="text-[clamp(1.25rem,2.5vw,1.5rem)] tracking-widest text-cyan-400 font-bold mb-1">{phase.title}</h3>
                                <div className="text-sm text-white/50 tracking-wider uppercase">{phase.role}</div>
                              </div>
                              <span className="text-xs font-bold tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5">
                                {phase.period}
                              </span>
                            </div>
                            
                            <p className="text-base text-white/80 leading-relaxed mb-6 font-medium">
                              {phase.desc}
                            </p>
                            
                            {phase.details && (
                              <div className="space-y-3 pl-4 border-l-2 border-white/10 group-hover:border-red-500/30 transition-colors">
                                {phase.details.map((detail, idx) => (
                                  <p key={idx} className={`text-sm leading-relaxed ${detail.startsWith('-') ? 'text-white/50 pl-2' : 'text-white/70 font-semibold'}`}>
                                    {detail}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* BREACHES */}
                <section>
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-2 h-2 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                    <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] tracking-widest text-white/90">{t.ui.systemBreaches}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {t.projects.map((p, i) => {
                      const Icon = p.icon;
                      return (
                      <motion.div 
                        key={i} 
                        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, delay: shouldReduceMotion ? 0 : i * 0.08 }}
                        className="relative h-[380px] sm:h-[340px] lg:h-[320px] w-full group [perspective:2000px] [transform-style:preserve-3d]"
                      >
                        {/* Folder Back (Inside) */}
                        <div className="absolute inset-0">
                          {/* Tab */}
                          <div className="absolute top-0 left-0 w-[130px] h-10 border-t border-l border-r border-white/10 bg-[#050505] rounded-t-xl flex items-center px-4 z-10 transition-colors group-hover:border-cyan-500/30">
                            <span className="text-[10px] text-white/60 group-hover:text-cyan-400 tracking-widest font-bold transition-colors">DIR // {p.id}</span>
                          </div>
                          {/* Back Content Area */}
                          <div className="absolute top-10 bottom-0 left-0 right-0 border border-white/10 bg-[#050505] p-6 flex flex-col items-center justify-center overflow-hidden rounded-b-xl rounded-tr-xl transition-colors group-hover:border-cyan-500/30">
                             {/* Hide border under tab */}
                             <div className="absolute top-[-1px] left-0 w-[128px] h-[2px] bg-[#050505] z-20"></div>
                          </div>
                        </div>

                        {/* Red/Cyan Halo Light Emanating from Inside */}
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-transparent group-hover:bg-gradient-to-r group-hover:from-red-500/20 group-hover:to-cyan-500/20 blur-[30px] rounded-[100%] transition-all duration-700 ease-out group-hover:-translate-y-6 pointer-events-none z-10"></div>

                        {/* Folder Front Cover */}
                        <div className="absolute top-10 bottom-0 left-0 right-0 origin-bottom transition-all duration-500 ease-out group-hover:[transform:rotateX(-15deg)] bg-[#0a0a0a] border border-white/10 p-6 flex flex-col z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.4)] group-hover:border-cyan-500/50 rounded-xl group-hover:shadow-[0_-15px_40px_rgba(34,211,238,0.15)]">
                          {/* Inner top lip for 3D paper effect */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 rounded-t-xl"></div>
                          
                          <div className="flex items-center gap-4 mb-4 sm:mb-6 relative z-10 shrink-0">
                            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-cyan-500/10 transition-colors">
                              <Icon size={20} className="text-white/60 group-hover:text-cyan-400 transition-colors shrink-0" />
                            </div>
                            <h3 className="text-[clamp(1rem,2vw,1.125rem)] tracking-widest font-bold group-hover:text-white transition-colors">{p.title}</h3>
                          </div>
                          <div className="flex-1 relative z-10 overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            <p className="text-[clamp(0.8rem,1.8vw,0.875rem)] text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                              {p.desc}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 relative z-10 shrink-0">
                            {p.tags.map(t => (
                              <span key={t} className="text-[clamp(0.55rem,1.2vw,0.625rem)] border border-white/10 bg-black/50 px-2 py-1 text-white/50 rounded-md whitespace-nowrap group-hover:border-cyan-500/30 group-hover:text-cyan-200 transition-colors">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )})}
                  </div>
                </section>

                {/* ARSENAL */}
                <section>
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-2 h-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                    <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] tracking-widest text-white/90">{t.ui.technicalArsenal}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 to-transparent"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {SKILLS.map((skill, i) => {
                      const Icon = skill.i;
                      
                      return (
                      <motion.div 
                        key={i} 
                        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: shouldReduceMotion ? 0.2 : 0.4, delay: shouldReduceMotion ? 0 : i * 0.05 }}
                        className="bg-black/40 border border-white/10 p-6 flex flex-col items-center justify-center gap-4 hover:border-red-500/50 hover:bg-gradient-to-b hover:from-red-500/10 hover:to-transparent transition-all duration-300 rounded-lg group"
                      >
                        <div className="text-white/40 shrink-0 group-hover:text-red-400 transition-colors duration-300 group-hover:scale-110 transform">
                          <Icon size={28} />
                        </div>
                        <div className="flex flex-col items-center gap-2 w-full">
                          <span className="text-xs tracking-widest text-white/80 font-bold group-hover:text-white transition-colors duration-300">{skill.n}</span>
                          
                          {/* Modern Progress Bar */}
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.lvl}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: shouldReduceMotion ? 0.2 : 1, delay: shouldReduceMotion ? 0 : 0.2 + (i * 0.05), ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-cyan-500 to-red-500"
                            />
                          </div>
                          <span className="text-[10px] text-white/40 group-hover:text-red-300 font-mono">{skill.lvl}%</span>
                        </div>
                      </motion.div>
                    )})}
                  </div>
                </section>

                {/* Footer Text in Main Page */}
                <div className="pt-8 pb-4 border-t border-white/10 flex items-start gap-4 text-[10px] text-white/40 opacity-70">
                  <div className="w-4 h-4 border border-red-500/50 flex-shrink-0 mt-0.5"></div>
                  <p>{t.ui.footerText}</p>
                </div>

              </div>
            </motion.main>
          ) : null}
        </AnimatePresence>


      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'en';
    }

    const saved = window.localStorage.getItem('portfolio.lang');
    return saved === 'en' || saved === 'fr' ? saved : 'en';
  });

  useEffect(() => {
    window.localStorage.setItem('portfolio.lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const contextValue = useMemo(() => ({
    lang,
    setLang,
    t: TRANSLATIONS[lang],
  }), [lang]);

  return (
    <LanguageContext.Provider value={contextValue}>
      <LanguageSwitcher />
      <AppContent />
    </LanguageContext.Provider>
  );
}
