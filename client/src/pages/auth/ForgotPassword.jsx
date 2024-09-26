import {
  Alert,
  AlertDescription,
  AlertTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormInput,
  FormPassword,
  Input,
  Label,
  LoadingButton,
} from "@/components";
import icons from "@/lib/icons";
import path from "@/lib/path";
import { restPasswordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as apis from "@/apis";
import { toast } from "sonner";
import useCurrentStore from "@/zustand/useCurrentStore";

const { AlertCircle, MoveLeft } = icons;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setEmailSendOtp = useCurrentStore((state) => state.setEmail);

  const handleSubmit = async () => {
    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }
    try {
      setIsLoading(true);
      const response = await apis.forgotPassword(email);
      if (response.success) {
        toast.success(response.mes);
        setEmailSendOtp(email);
        setError("");
        setShowResetPassword(true);
      }
    } catch (error) {
      setEmail(error.response.data.mes);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogRestPassword
        open={showResetPassword}
        onOpenChange={() => setShowResetPassword(false)}
      />
      <main className="flex h-screen items-center justify-center p-5">
        <div className="h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-lg">
          <div className="w-full space-y-10 overflow-y-auto p-10">
            <div className="space-y-1 text-center relative">
              <h1 className="text-3xl font-bold">Quên mật khẩu</h1>
              <span className="text-muted-foreground">
                Vui lòng nhập email vào đây để tiến hành quên mật khẩu.
              </span>
              <Link
                to={`/${path.AUTH}/${path.LOGIN}`}
                title="Quay về trang đăng nhập"
                className="absolute top-0 left-0 cursor-pointer p-2 border rounded-full hover:bg-muted"
              >
                <MoveLeft className="size-5" />
              </Link>
            </div>
            <div className="flex flex-col space-y-5">
              {error && (
                <Alert variant={"destructive"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Địa chỉ email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email vào đây"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <LoadingButton loading={isLoading} onClick={handleSubmit}>
                Gửi
              </LoadingButton>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ForgotPassword;

const DialogRestPassword = ({ open, onOpenChange }) => {
  const navigte = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setEmail, email } = useCurrentStore();

  const form = useForm({
    resolver: zodResolver(restPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = data;

    try {
      setIsLoading(true);
      const response = await apis.resetPassword(payload, email);
      if (response.success) {
        toast.success(response.mes);
        setEmail(null);
        onOpenChange();
        navigte(`/${path.AUTH}/${path.LOGIN}`);
      }
    } catch (error) {
      toast.error(error.response.data.mes);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đặt lại mật khẩu</DialogTitle>
          <DialogDescription>
            Vui lòng nhập mật khẩu mới và xác nhận lại.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
              form={form}
              lable="Nhập Otp"
              name="otp"
              placeholder="Nhập otp..."
            />
            <FormPassword
              form={form}
              lable="Mật khẩu"
              name="password"
              placeholder="Mật khẩu..."
            />
            <FormPassword
              form={form}
              lable="Nhập lại mật khẩu"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu..."
            />
            <LoadingButton
              loading={isLoading}
              type="submit"
              className={"w-full"}
            >
              Đặt lại mật khẩu
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
