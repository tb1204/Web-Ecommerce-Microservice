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
