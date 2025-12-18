'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [displayContent, setDisplayContent] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setDisplayContent(false);
    
    // Longer delay for smoother blur effect
    const showTimer = setTimeout(() => {
      setDisplayContent(true);
    }, 250);
    
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  return (
    <>
      {/* Blur overlay while loading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9998] pointer-events-none"
        style={{
          backdropFilter: isLoading ? 'blur(25px)' : 'blur(0px)',
          WebkitBackdropFilter: isLoading ? 'blur(25px)' : 'blur(0px)',
          backgroundColor: isLoading ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
        }}
      />
      
      {/* Page content - only show when ready */}
      {displayContent && (
        <motion.div
          key={pathname}
          initial={{ opacity: 0, filter: 'blur(25px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ 
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
