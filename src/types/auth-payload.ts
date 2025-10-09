export interface AuthPayload {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin" | "owner";
}
