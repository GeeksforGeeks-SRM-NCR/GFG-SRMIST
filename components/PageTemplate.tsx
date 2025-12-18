'use client';

import { ReactNode } from 'react';
import GlassyNavbar from '@/app/components/GlassyNavbar';

interface PageTemplateProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export default function PageTemplate({ children, showNavbar = true }: PageTemplateProps) {
  return (
    <>
      {/* Fixed Navbar - Completely Locked in Place */}
      {showNavbar && (
        <div 
          className="fixed top-0 left-0 right-0 z-[9999]"
          style={{ 
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)',
            willChange: 'auto',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            perspective: 1000,
            WebkitPerspective: 1000,
            position: 'fixed',
            isolation: 'isolate',
          }}
        >
          <GlassyNavbar />
        </div>
      )}
      
      {/* Page Content Below Navbar */}
      <div className="relative" style={{ isolation: 'isolate' }}>
        {children}
      </div>
    </>
  );
}
