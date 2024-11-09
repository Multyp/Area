'use client';

// Global imports
import { ReactElement, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ScrollTop = ({ children }: { children: ReactElement | null }) => {
  const asPath = usePathname();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [asPath]);

  return children || null;
};

export default ScrollTop;
