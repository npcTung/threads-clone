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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Label,
  LoadingButton,
  PasswordInput,
} from "@/components";
import icons from "@/lib/icons";
import path from "@/lib/path";
import { restPasswordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const { AlertCircle, MoveLeft } = icons;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handleSubmit = () => {
    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }
    console.log(email);
    setShowResetPassword(true);
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
              <LoadingButton onClick={handleSubmit}>Gửi</LoadingButton>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ForgotPassword;

const DialogRestPassword = ({ open, onOpenChange }) => {
  const [error, setError] = useState("");
  const navigte = useNavigate();

  const form = useForm({
    resolver: zodResolver(restPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    onOpenChange();
    navigte(`/${path.AUTH}/${path.LOGIN}`);
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
          {error && (
            <Alert variant={"destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập otp..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Nhập mật khẩu..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập lại mật khẩu</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Nhập lại mật khẩu..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <LoadingButton type="submit" className={"w-full"}>
              Đặt lại mật khẩu
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
