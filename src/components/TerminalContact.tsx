import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, X, ShieldAlert, Wifi, Activity, Cpu } from 'lucide-react';

interface TerminalContactProps {
  onClose: () => void;
}

// Typewriter component for system messages
const TypewriterLine = ({ text, isError, onComplete, speed = 10 }: { text: string, isError?: boolean, onComplete?: () => void, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  
  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={`${isError ? 'text-red-500' : 'text-cyan-400'} uppercase tracking-wider font-bold`}>
      {displayedText}
    </span>
  );
};

export function TerminalContact({ onClose }: TerminalContactProps) {
  const [step, setStep] = useState<'name' | 'email' | 'message' | 'sending' | 'success' | 'error'>('name');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [visibleLines, setVisibleLines] = useState(1);
  
  const [history, setHistory] = useState<{ id: number; type: 'system' | 'user'; text: string; isError?: boolean; speed?: number }[]>([
    { id: 1, type: 'system', text: 'SYS v2.0.4 // INITIALIZING SECURE UPLINK...', speed: 5 },
    { id: 2, type: 'system', text: 'WARNING: UNAUTHORIZED ACCESS DETECTED.', isError: true, speed: 5 },
    { id: 3, type: 'system', text: 'BYPASSING SECURITY PROTOCOLS... [SUCCESS]', speed: 5 },
    { id: 4, type: 'system', text: 'ENTER IDENTIFIER (NAME):', speed: 15 }
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current && !isTyping) {
      inputRef.current.focus();
    }
  }, [step, isTyping]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isTyping, visibleLines, inputValue]);

  const addSystemMessage = (text: string, isError = false, speed = 15) => {
    setIsTyping(true);
    setHistory(prev => [...prev, { id: Date.now() + Math.random(), type: 'system', text, isError, speed }]);
    setVisibleLines(prev => prev + 1);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() && !isTyping) {
      const val = inputValue.trim();
      setInputValue('');
      
      setHistory(prev => [...prev, { id: Date.now(), type: 'user', text: val }]);
      setVisibleLines(prev => prev + 1);

      if (step === 'name') {
        setName(val);
        setStep('email');
        setTimeout(() => addSystemMessage('ENTER RETURN NODE (EMAIL):'), 200);
      } else if (step === 'email') {
        if (!/^\S+@\S+\.\S+$/.test(val)) {
          setTimeout(() => addSystemMessage('ERR: INVALID NODE FORMAT. RETRY:', true), 200);
          return;
        }
        setEmail(val);
        setStep('message');
        setTimeout(() => addSystemMessage('INPUT DATA PAYLOAD (MESSAGE):'), 200);
      } else if (step === 'message') {
        setMessage(val);
        setStep('sending');
        setTimeout(() => addSystemMessage('ENCRYPTING PAYLOAD... TRANSMITTING...', false, 5), 200);
        
        try {
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message: val })
          });
          
          if (response.ok) {
            setTimeout(() => {
              addSystemMessage('TRANSMISSION SUCCESSFUL. TRACES WIPED.', false, 5);
              setStep('success');
            }, 1000);
          } else {
            throw new Error('Failed to send');
          }
        } catch (error) {
          setTimeout(() => {
            addSystemMessage('FATAL ERR: TRANSMISSION BLOCKED BY SYS FIREWALL.', true, 5);
            setStep('error');
          }, 1000);
        }
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 sm:bg-black/90 sm:backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 1.05, opacity: 0, filter: 'brightness(2) contrast(1.5)' }}
        animate={{ scale: 1, opacity: 1, filter: 'brightness(1) contrast(1)' }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`w-full max-w-3xl bg-black border-2 ${step === 'error' ? 'border-red-500 sm:shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'border-cyan-500 sm:shadow-[0_0_30px_rgba(34,211,238,0.2)]'} flex flex-col relative`}
        onClick={e => e.stopPropagation()}
      >
        {/* ctOS Corner Accents */}
        <div className={`absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 ${step === 'error' ? 'border-red-500' : 'border-cyan-400'} z-50`}></div>
        <div className={`absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 ${step === 'error' ? 'border-red-500' : 'border-cyan-400'} z-50`}></div>
        <div className={`absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 ${step === 'error' ? 'border-red-500' : 'border-cyan-400'} z-50`}></div>
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 ${step === 'error' ? 'border-red-500' : 'border-cyan-400'} z-50`}></div>

        {/* ctOS Header */}
        <div className={`flex items-center justify-between px-4 py-2 ${step === 'error' ? 'bg-red-500 text-black' : 'bg-cyan-500 text-black'} relative z-30 font-bold tracking-widest uppercase text-xs sm:text-sm`}>
          <div className="flex items-center gap-3">
            {step === 'error' ? <ShieldAlert size={16} className="animate-pulse" /> : <Activity size={16} />}
            <span>SYS // ROOT_ACCESS_GRANTED</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 opacity-70">
              <div className="w-1 h-3 bg-black animate-pulse"></div>
              <div className="w-1 h-3 bg-black animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-3 bg-black animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <button onClick={onClose} className="hover:bg-black hover:text-white px-2 py-0.5 transition-colors flex items-center gap-1">
              <span>[</span>
              <X size={14} />
              <span className="hidden sm:inline">DISCONNECT</span><span className="sm:hidden">EXIT</span> <span>]</span>
            </button>
          </div>
        </div>

        {/* Technical Bar */}
        <div className="h-6 border-b border-white/10 bg-[#050505] flex items-center px-4 gap-4 text-[10px] text-white/40 font-mono tracking-widest overflow-hidden">
          <span className="flex items-center gap-1"><Cpu size={10} /> SYS.MEM: 0x8F4A</span>
          <span className="text-cyan-500/50">|</span>
          <span className="flex items-center gap-1"><Wifi size={10} /> NET.LATENCY: 12ms</span>
          <span className="text-cyan-500/50">|</span>
          <span className="animate-pulse">REC: ACTIVE</span>
        </div>

        {/* Terminal Body */}
        <div 
          className="p-4 sm:p-6 h-[50vh] min-h-[300px] max-h-[450px] overflow-y-auto font-mono text-sm sm:text-base flex flex-col relative z-10 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent"
          onClick={() => { if (!isTyping) inputRef.current?.focus(); }}
        >
          {history.slice(0, visibleLines).map((line, i) => (
            <div 
              key={line.id} 
              className={`mb-4 flex flex-col sm:flex-row sm:gap-3 ${line.type === 'user' ? 'text-white' : ''}`}
            >
              {line.type === 'system' ? (
                <>
                  <span className="text-white/30 shrink-0 hidden sm:block">SYS&gt;</span>
                  <TypewriterLine 
                    text={line.text} 
                    isError={line.isError} 
                    speed={line.speed}
                    onComplete={() => {
                      if (i === visibleLines - 1 && visibleLines < history.length) {
                        setVisibleLines(v => v + 1);
                      } else if (i === history.length - 1) {
                        setIsTyping(false);
                      }
                    }} 
                  />
                </>
              ) : (
                <>
                  <span className="text-white/30 shrink-0 hidden sm:block">USER&gt;</span>
                  <span className="text-white font-bold tracking-wider">{line.text}</span>
                </>
              )}
            </div>
          ))}
          
          {step !== 'sending' && step !== 'success' && step !== 'error' && !isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center mt-2 text-white"
            >
              <span className="mr-3 text-cyan-400 font-bold shrink-0">USER&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-white font-bold tracking-wider w-full placeholder-white/20 uppercase"
                autoComplete="off"
                spellCheck="false"
              />
              <motion.div 
                animate={{ opacity: [1, 0, 1] }} 
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-3 h-5 bg-cyan-400 ml-1"
              />
            </motion.div>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>
        
        {/* ctOS Scanline / Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[url('/src/assets/scanline-overlay.svg')] opacity-30 mix-blend-overlay z-0 hidden sm:block"></div>
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] z-0 hidden sm:block"></div>
        
        {/* Glitch Line Effect */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none z-20 hidden sm:block"
        />
      </motion.div>
    </motion.div>
  );
}
