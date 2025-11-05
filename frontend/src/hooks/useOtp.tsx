import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendOtp, verifyOtp } from "../services/otpService";

export const useSendOtp = () => {
  return useMutation({
    mutationFn: sendOtp,
  });
};

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (otp: string) => verifyOtp(otp),
    onSuccess(data) {
      console.log("✅ OTP verified successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
