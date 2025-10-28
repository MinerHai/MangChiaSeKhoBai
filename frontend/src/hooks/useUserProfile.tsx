import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../services/authService";

export const useUserProfile = (token: string) => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(token),
    enabled: !!token,
    staleTime: 60 * 60 * 1000, // 1h
  });
};
