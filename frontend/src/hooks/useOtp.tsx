import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendOtp, verifyOtp } from "../services/otpService";

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (token: string) => sendOtp(token),
  });
};

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, otp }: { token: string; otp: string }) =>
      verifyOtp(token, otp),
    onSuccess(data) {
      console.log("OTP verified successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
