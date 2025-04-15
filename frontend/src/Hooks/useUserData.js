import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useUserData = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    
    const token = localStorage.getItem("token");
    
    const { data: userData, isLoading, error } = useQuery({
      queryKey: ["userData"],
      queryFn: async () => {
        if (!token) {
          throw new Error("No token available");
        }
        
        const response = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Log the response to see what's coming from the API
        console.log("API Response:", response.data);
        
        // Return the normalized user data
        return response.data.user || response.data;
      },
      onSuccess: (data) => {
        setIsAuthenticated(true);
      },
      onError: (error) => {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          navigate('/login');
        }
      },
      retry: (failureCount, error) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
      enabled: !!token,
    });
    
    const logout = useCallback(() => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/login');
    }, [navigate]);
    
    // Return the userData directly from useQuery
    return { user: userData, isAuthenticated, isLoading, error, logout };
  };