import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Reset scroll position to top on every route change.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Instant jump for route changes
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}
