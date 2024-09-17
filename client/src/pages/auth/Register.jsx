import React from "react";
import SignUpImage from "@/assets/signup-image.jpg";
import { Link } from "react-router-dom";
import path from "@/lib/path";
import { SignUpForm } from "@/components";

const Register = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-lg border">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Đăng ký vào bugbookk</h1>
            <span className="text-muted-foreground">
              Nơi mà ngay cả <span className="italic">bạn</span> cũng có thể tìm
              thấy một người bạn.
            </span>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <div className="flex items-center justify-center gap-1">
              <span>Bạn đã có tài khoản?</span>
              <Link
                to={`/${path.AUTH}/${path.LOGIN}`}
                className="text-blue-700 transition-all hover:underline"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
        <img
          src={SignUpImage}
          alt="background signup image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
};

export default Register;
