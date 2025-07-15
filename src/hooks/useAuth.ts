import { useState, useEffect } from "react";
import { StorageService } from "../utils/storage";

export const useAuth = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const email = StorageService.getUserEmail();
    setUserEmail(email);
    setIsLoading(false);
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