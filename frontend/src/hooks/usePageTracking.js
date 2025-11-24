import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../services/api';

/**
 * Custom hook to track page views when route changes
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track the page view
    const path = location.pathname;
    const referrer = document.referrer || null;

    trackPageView(path, referrer);
  }, [location]);
};

export default usePageTracking;
