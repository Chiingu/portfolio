import React from 'react';
import mbLogo from '../assets/mb-logo.svg';

export const MbLogo = React.memo(({ className }: { className?: string }) => (
  <img src={mbLogo} alt="MB Logo" className={`w-full h-auto ${className || ''}`} />
));
