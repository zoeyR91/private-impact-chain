import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#10B981', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#059669', stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#FFFFFF', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#F3F4F6', stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="chainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#1D4ED8', stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        {/* Main Background Circle */}
        <circle cx="16" cy="16" r="15" fill="url(#bgGradient)" stroke="#FFFFFF" strokeWidth="1"/>
        
        {/* Shield Icon (Privacy Protection) */}
        <path d="M16 4L10 8V14C10 18 13 21 16 22C19 21 22 18 22 14V8L16 4Z" 
              fill="url(#shieldGradient)" 
              stroke="#10B981" 
              strokeWidth="1"/>
        
        {/* Lock Icon inside Shield */}
        <rect x="14" y="12" width="4" height="3" rx="0.5" fill="#10B981"/>
        <path d="M15 12V10C15 9.5 15.5 9 16 9C16.5 9 17 9.5 17 10V12" 
              stroke="#10B981" 
              strokeWidth="1" 
              fill="none"/>
        
        {/* FHE Encryption Symbol (Small dots representing encrypted data) */}
        <circle cx="12" cy="16" r="0.8" fill="#10B981" opacity="0.7"/>
        <circle cx="20" cy="16" r="0.8" fill="#10B981" opacity="0.7"/>
        <circle cx="16" cy="18" r="0.6" fill="#10B981" opacity="0.5"/>
        
        {/* Chain Links (Impact Chain) with enhanced design */}
        <circle cx="8" cy="24" r="2" fill="url(#chainGradient)" opacity="0.9"/>
        <circle cx="12" cy="24" r="2" fill="url(#chainGradient)" opacity="0.7"/>
        <circle cx="16" cy="24" r="2" fill="url(#chainGradient)" opacity="0.5"/>
        <circle cx="20" cy="24" r="2" fill="url(#chainGradient)" opacity="0.3"/>
        <circle cx="24" cy="24" r="2" fill="url(#chainGradient)" opacity="0.1"/>
        
        {/* Connection Lines with gradient effect */}
        <path d="M10 24L11 24" stroke="url(#chainGradient)" strokeWidth="1.5" opacity="0.7"/>
        <path d="M14 24L15 24" stroke="url(#chainGradient)" strokeWidth="1.5" opacity="0.5"/>
        <path d="M18 24L19 24" stroke="url(#chainGradient)" strokeWidth="1.5" opacity="0.3"/>
        <path d="M22 24L23 24" stroke="url(#chainGradient)" strokeWidth="1.5" opacity="0.1"/>
        
        {/* Impact measurement lines (representing impact tracking) */}
        <path d="M6 8L8 6" stroke="#10B981" strokeWidth="1" opacity="0.6"/>
        <path d="M26 8L24 6" stroke="#10B981" strokeWidth="1" opacity="0.6"/>
        <path d="M6 12L8 10" stroke="#10B981" strokeWidth="1" opacity="0.4"/>
        <path d="M26 12L24 10" stroke="#10B981" strokeWidth="1" opacity="0.4"/>
      </svg>
    </div>
  );
};
