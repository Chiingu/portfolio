import React, { useState, useEffect } from 'react';

export const Typewriter = ({ text, delay = 15, onComplete }: { text: string, delay?: number, onComplete?: () => void }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay, onComplete]);
  
  return <span>{displayed}</span>;
};
