import API from "./APIClient";

export const sendOtp = async (token: string) => {
  const response = await API.post(
    "/otp/send",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const verifyOtp = async (token: string, otp: string) => {
  const response = await API.post(
    "/otp/verify",
    { otp },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
