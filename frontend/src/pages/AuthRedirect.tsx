// import { useUser, useSession } from "@clerk/clerk-react";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// const AuthRedirect = () => {
//   const { isLoaded: userLoaded, isSignedIn, user } = useUser();
//   const { session, isLoaded: sessionLoaded } = useSession();
//   const navigate = useNavigate();
//   const [attempt, setAttempt] = useState(0);

//   useEffect(() => {
//     if (!userLoaded || !sessionLoaded) return;

//     if (!isSignedIn || !user || !session) {
//       navigate("/login", { replace: true });
//       return;
//     }

//     const checkAndRedirect = async () => {
//       let role = user.publicMetadata?.role as string | undefined;

//       // Nếu chưa có role → force reload session (JWT refresh)
//       if (!role && attempt < 3) {
//         // retry tối đa 3 lần
//         console.log(
//           `Role chưa load (lần ${attempt + 1}), force reload session...`,
//         );
//         await session.reload(); // Đây là bước quan trọng để lấy metadata mới
//         setAttempt((prev) => prev + 1);
//         return; // Chờ effect chạy lại sau reload
//       }

//       console.log("Final role:", role);
//       console.log("Full publicMetadata:", user.publicMetadata);

//       if (role === "admin") {
//         navigate("/admin", { replace: true });
//       } else {
//         navigate("/", { replace: true });
//       }
//     };

//     checkAndRedirect();
//   }, [userLoaded, sessionLoaded, isSignedIn, user, session, attempt, navigate]);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
//           Đang chuyển hướng...
//         </h2>
//         <p className="text-gray-600 dark:text-gray-300">
//           Vui lòng chờ giây lát trong khi chúng tôi xác định vai trò của bạn.
//         </p>
//       </div>
//     </div>
//   );
// };

import { useUser, useSession } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AuthRedirect = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const { session, isLoaded: sessionLoaded } = useSession();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(0);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (!userLoaded || !sessionLoaded) return;

    if (!isSignedIn || !user || !session) {
      navigate("/login", { replace: true });
      return;
    }

    const checkAndRedirect = async () => {
      let role = user.publicMetadata?.role as string | undefined;

      if (!role && attempt < 3) {
        console.log(
          `Role chưa load (lần ${attempt + 1}), force reload session...`,
        );
        await session.reload();
        setAttempt((prev) => prev + 1);
        return;
      }

      console.log("Final role:", role);
      console.log("Full publicMetadata:", user.publicMetadata);

      setShowLoading(false);

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    };

    checkAndRedirect();
  }, [userLoaded, sessionLoaded, isSignedIn, user, session, attempt, navigate]);

  if (showLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center relative">
        <div className="w-[180px] h-[180px] overflow-hidden relative">
          <div className="w-full h-full relative">
            <div
              className="
                absolute top-5 left-5
                w-32 h-32 rounded-full
                animate-eclipseRotate
                origin-[64px_66px]
                shadow-[0_4px_0_0_theme(colors.ft)]
              "
            />
          </div>
        </div>

        <p className="absolute bottom-8 text-ft dark:text-emerald-300 font-medium animate-pulse text-base md:text-lg">
          Đang xác thực vai trò...
        </p>
      </div>
    );
  }

  // Phần chuyển hướng nhanh (chỉ flash rất ngắn)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
      <p className="text-ft dark:text-emerald-300 font-medium text-lg">
        Đang chuyển hướng...
      </p>
    </div>
  );
};

export default AuthRedirect;
