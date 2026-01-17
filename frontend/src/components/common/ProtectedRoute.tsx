// components/Common/ProtectedRoute.tsx
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "admin" | "user"; // Định nghĩa role nếu cần
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn, user } = useUser();

  // Đợi Clerk tải xong thông tin session
  if (!isLoaded) {
    return <div>Loading...</div>; // Hoặc một Loading Spinner
  }
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  if (role === "admin") {
    // Lưu ý: Role trong Clerk thường nằm trong publicMetadata
    const userRole = user?.publicMetadata?.role;

    if (userRole !== "admin") {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
