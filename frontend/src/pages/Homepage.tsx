import { useEffect, useState } from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "../stores/useAuthStore";

const Homepage = () => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  }, []);

  return <div>This is Homepage</div>;
};

export default Homepage;
