import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollRestoration = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // We only want to scroll to top on NEW navigations (PUSH)
    // Browsers natively handle scroll restoration on "POP" (Back/Forward) and "Reload"
    // as long as we don't interfere with manual window.scrollTo(0,0) on every mount.
    
    if (navType === "PUSH") {
      window.scrollTo(0, 0);
      // Also clear internal scroll positions for specific pages
      sessionStorage.removeItem('services-scroll-pos');
    }
    
    // For RELOAD and POP, we let the browser work its magic.
    // However, some React pages might render late. 
    // If the scroll doesn't happen, one could implement a manual restoration here 
    // using sessionStorage, but let's first try the standard approach of 
    // just disabling the aggressive "scroll to top on every mount" in the pages.
    
  }, [pathname, navType]);

  return null;
};

export default ScrollRestoration;
