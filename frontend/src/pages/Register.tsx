import { SignUp } from "@clerk/clerk-react";
import registerImg from "../assets/register.jpg";
import { useLocation } from "react-router-dom";

const Register = () => {
  const location = useLocation();
  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/dashboard";

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* CỘT TRÁI: Chứa Form - Quan trọng nhất là w-full */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-black uppercase">
            ARTISANO
          </h2>
          <p className="text-gray-500 mt-2">
            Tham gia cùng chúng tôi ngay hôm nay
          </p>
        </div>

        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          fallbackRedirectUrl={redirect}
          appearance={{
            elements: {
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              headerLogoBox: "hidden",
              formButtonPrimary:
                "bg-black hover:bg-gray-800 text-sm normal-case",

              // CẢI THIỆN Ở ĐÂY:
              rootBox: "w-full flex justify-center", // Ép Clerk root luôn nằm giữa div cha
              card: "shadow-md border border-gray-100 mx-auto w-full max-w-[400px]",
              // Thêm mx-auto (căn giữa lề) và w-full
            },
          }}
        />
      </div>

      {/* CỘT PHẢI: Chứa ảnh (Chỉ hiện từ màn hình md trở lên) */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center bg-gray-100">
        <div className="w-full h-full">
          <img
            src={registerImg}
            alt="Create an Account"
            className="h-full w-full object-cover shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
