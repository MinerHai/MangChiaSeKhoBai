import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../services/authService";
import { useAuth } from "../stores/useAuthStore";

export const useUserProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["userProfile", user?._id],
    queryFn: () => fetchUserProfile(),
    staleTime: 60 * 60 * 1000, // 1h
  });
};
