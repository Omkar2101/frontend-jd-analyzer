

// import { useState, useEffect } from "react";
// import { StorageService } from "../utils/storage";

// export const useAuth = () => {
//   const [userEmail, setUserEmail] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const email = StorageService.getUserEmail();
//     setUserEmail(email);
//     setIsLoading(false);
//   }, []);

//   const logout = (): boolean => {
//     const success = StorageService.removeUserEmail();
//     if (success) {
//       setUserEmail(null);
//     }
//     return success;
//   };

//   return { userEmail, isLoading, logout };
// };

import { useState, useEffect } from "react";
import { StorageService } from "../utils/storage";

export const useAuth = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    const email = StorageService.getUserEmail();
    setUserEmail(email);
    setIsLoading(false);

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userEmail') {
        setUserEmail(e.newValue);
      }
    };

    // Listen for custom events (when user logs in/out in same tab)
    const handleAuthChange = () => {
      const email = StorageService.getUserEmail();
      setUserEmail(email);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange as EventListener);
    };
  }, []);

  const logout = (): boolean => {
    const success = StorageService.removeUserEmail();
    if (success) {
      setUserEmail(null);
    }
    return success;
  };

  return { userEmail, isLoading, logout };
};