import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateToRoute = useCallback((route: string) => {
    try {
      navigate(route);
    } catch (error) {
      console.error(`Navigation error to route ${route}:`, error);
      // Optionally show user-friendly error message
      // You could use a toast notification here
    }
  }, [navigate]);

  return { navigateToRoute };
};