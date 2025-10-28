import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Spinner, Center } from "@chakra-ui/react";
import { fetchUserProfile } from "../../services/authService";
import { useAuth } from "../../stores/useAuthStore";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, setUser, clearUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchUserProfile(token);
        setUser(data.user);
      } catch (err) {
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [token, setUser, clearUser]);

  if (loading)
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/error" state={{ status: 403 }} />;
  }

  return <>{children}</>;
}
