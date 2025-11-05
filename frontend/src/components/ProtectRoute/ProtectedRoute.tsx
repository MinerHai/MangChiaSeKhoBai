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

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data.user);
      } catch (err) {
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [setUser, clearUser]);

  if (loading)
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/error" state={{ status: 403 }} />;
  }

  return <>{children}</>;
}
