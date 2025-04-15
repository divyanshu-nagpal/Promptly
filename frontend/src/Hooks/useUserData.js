import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useUserData = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const queryClient = useQueryClient();

    
    // Main query to fetch user data
    const { data: userData, isLoading, error, refetch } = useQuery({
      queryKey: ["userData"],
      queryFn: async () => {
        if (!token) {
          throw new Error("No token available");
        }
        
        const response = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        return response.data.user || response.data;
      },
      onError: (error) => {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      },
      retry: (failureCount, error) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
      enabled: !!token, // Only run query if token exists
    });
    
    const isAuthenticated = !!token && !!userData;
    
    const logout = useCallback(() => {
      localStorage.removeItem('token');
      
      // Clear the React Query cache for user data
      queryClient.removeQueries(["userData"]);
      
      navigate('/login');
    }, [navigate]);
    
    return { user: userData, isAuthenticated, isLoading, error, logout };
  };