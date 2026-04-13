import React from 'react';
import cornerTl from '../assets/corner-tl.svg';
import cornerTr from '../assets/corner-tr.svg';
import cornerBl from '../assets/corner-bl.svg';
import cornerBr from '../assets/corner-br.svg';

export const SvgFrame = React.memo(({ children, className = "", active = false }: { children: React.ReactNode, className?: string, active?: boolean }) => (
  <div className={`relative p-6 border border-white/20 ${active ? 'bg-white/5' : ''} ${className}`}>
    <img src={cornerTl} alt="" className="absolute top-0 left-0 w-4 h-4" />
    <img src={cornerTr} alt="" className="absolute top-0 right-0 w-4 h-4" />
    <img src={cornerBl} alt="" className="absolute bottom-0 left-0 w-4 h-4" />
    <img src={cornerBr} alt="" className="absolute bottom-0 right-0 w-4 h-4" />
    <div className="relative z-10 h-full flex flex-col">{children}</div>
  </div>
));
