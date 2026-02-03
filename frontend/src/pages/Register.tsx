import { SignUp, useUser } from "@clerk/clerk-react";
import registerImg from "../assets/register.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  // Logic điều hướng sau khi đăng ký thành công
  useEffect(() => {
    if (isSignedIn && user) {
      const role = user.publicMetadata?.role;
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [isSignedIn, user, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* CỘT TRÁI: Chứa Form SignUp */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-black uppercase dark:text-white">
            ARTISANO
          </h2>
          <p className="text-gray-500 mt-2">
            Tham gia cùng chúng tôi ngay hôm nay
          </p>
        </div>

        <SignUp
          routing="hash"
          signInUrl="/login"
          appearance={{
            elements: {
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              headerLogoBox: "hidden",
              formButtonPrimary:
                "bg-black hover:bg-gray-800 text-sm normal-case",
              rootBox: "w-full flex justify-center",
              card: "shadow-md border border-gray-100 mx-auto w-full max-w-[400px] ",
            },
          }}
        />
      </div>

      {/* CỘT PHẢI: Chứa ảnh */}
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
