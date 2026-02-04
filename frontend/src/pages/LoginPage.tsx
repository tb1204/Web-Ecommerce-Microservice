import { SignIn, useUser } from "@clerk/clerk-react";
import loginImg from "../assets/login.webp";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginPage = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) {
      console.log("signin", isSignedIn);

      if (isSignedIn && user) {
        console.log("Full Public Metadata:", user.publicMetadata);
        const role = user.publicMetadata.role;
        console.log(role);
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* CỘT TRÁI: Chứa Form Clerk */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-black dark:text-white">
            ARTISANO
          </h2>
        </div>

        <SignIn
          routing="hash"
          signUpUrl="/register"
          appearance={{
            elements: {
              headerTitle: "hidden",
              formButtonPrimary:
                "bg-black hover:bg-gray-800 text-sm normal-case",
              rootBox: "max-w-full",
            },
          }}
        />
      </div>
      {/* CỘT PHẢI: Chứa ảnh (Ẩn trên mobile) */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={loginImg}
          alt="Login to Account"
          className="h-screen w-full object-cover shadow-2xl"
        />
      </div>
    </div>
  );
};

export default LoginPage;
