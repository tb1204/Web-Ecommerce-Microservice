import { SignIn } from "@clerk/clerk-react";
// import loginImg from "../assets/login.webp";
import loginImg from "../assets/loginpage.jpg";
const LoginPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* CỘT TRÁI: Form Clerk */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-black dark:text-white">
            ARTISANO
          </h2>
        </div>

        <SignIn
          routing="hash"
          signUpUrl="/register"
          afterSignInUrl="/auth-redirect" // ← Quan trọng: redirect đến trang trung gian sau sign-in
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

      {/* CỘT PHẢI: Ảnh (ẩn trên mobile) */}
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
