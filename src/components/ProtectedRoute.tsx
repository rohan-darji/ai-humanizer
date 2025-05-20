
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // While checking if user is authenticated, show nothing
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is authenticated, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
