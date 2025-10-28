export interface AuthPayload {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin" | "owner";
  avatar?: {
    public_id: string;
    secure_url: string;
  };
}
