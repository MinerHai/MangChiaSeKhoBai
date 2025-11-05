import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../services/authService";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(),
    staleTime: 60 * 60 * 1000, // 1h
  });
};
