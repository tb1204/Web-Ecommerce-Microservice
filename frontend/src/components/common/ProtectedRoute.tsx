// import { useUser } from "@clerk/clerk-react";
// import { Navigate } from "react-router-dom";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   role?: "admin" | "user";
// }

// const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
//   const { isLoaded, isSignedIn, user } = useUser();

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   if (!isSignedIn) {
//     return <Navigate to="/login" replace />;
//   }

//   if (role === "admin") {
//     const userRole = user?.publicMetadata?.role;

//     if (userRole !== "admin") {
//       return <Navigate to="/" replace />;
//     }
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;

// ProtectedRoute.tsx
import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  role?: "admin" | "user";
}

const ProtectedRoute = ({ children, role = "user" }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center relative">
        <div className="w-[200px] h-[200px] overflow-hidden relative">
          <div className="w-full h-full relative">
            <div
              className="
            absolute top-1/2 left-1/2 
            w-[160px] h-[160px] rounded-full 
            -translate-x-1/2 -translate-y-1/2
            animate-eclipseRotate 
            origin-[80px_82px] 
            shadow-[0_4px_0_0_var(--tw-shadow-color)] 
            shadow-ft
          "
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra quyền admin
  if (role === "admin") {
    const userRole = user?.publicMetadata?.role as string | undefined;
    if (userRole !== "admin") {
      return <Navigate to="/" replace />;
    }
  }

  // Nếu có children → render children (dùng cho trường hợp đặc biệt)
  // Nếu không có children → render Outlet (cho nested routes)
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
