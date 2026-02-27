import { SignUp, useUser } from "@clerk/clerk-react";
import registerImg from "../assets/register.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RegisterPage = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && user) {
      const role = user.publicMetadata?.role as string | undefined;
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [isSignedIn, user, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* CỘT TRÁI: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4">
        {/* <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-black uppercase dark:text-white">
            ARTISANO
          </h2>
          <p className="text-gray-500 mt-2">
            Tham gia cùng chúng tôi ngay hôm nay
          </p>
        </div> */}

        <SignUp
          routing="hash"
          signInUrl="/login"
          appearance={{
            layout: {
              socialButtonsVariant: "iconButton",
            },
            elements: {
              headerTitle:
                "w-full text-center text-2xl font-bold text-gray-900 ",
              headerSubtitle: "w-full text-center text-gray-600 mb-4",
              header: "w-full flex flex-col items-center",
              headerLogoBox: "hidden",
              formButtonPrimary:
                "bg-black hover:bg-gray-800 text-sm normal-case w-full",
              rootBox: "w-full flex justify-center",
              card: "shadow-md border border-gray-100 mx-auto w-full max-w-[400px] bg-white ",
              footer: "w-full flex justify-center",
              identityPreviewText: "text-center",
              identityPreviewEditButton: "mx-auto",
            },
          }}
        />
      </div>

      {/* CỘT PHẢI: Ảnh */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center bg-gray-100">
        <div className="w-full h-full">
          <img
            src={registerImg}
            alt="Đăng ký tài khoản"
            className="h-full w-full object-cover shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
