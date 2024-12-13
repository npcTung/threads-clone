import { loginSchema, setPassword } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  FinalRegister,
  Form,
  FormInput,
  FormPassword,
  Input,
  LoadingButton,
} from "..";
import { Link, useNavigate } from "react-router-dom";
import path from "@/lib/path";
import { cn } from "@/lib/utils";
import { useGoogleLogin } from "@react-oauth/google";
import * as apis from "@/apis";
import useCurrentStore from "@/zustand/useCurrentStore";
import { toast } from "sonner";

const LoginForm = () => {
  const [isSetupPassword, setIsSetupPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [showFinalRegister, setShowFinalRegister] = useState(false);
  const { setGoogleData, setEmail, setIsLoggedIn, setToken } =
    useCurrentStore();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await apis.checkVerifiedUserFromUserName(data.userName);
      if (response.isVerified) {
        const loginUser = await apis.login(data);
        if (loginUser.success) {
          setToken(loginUser.token);
          setIsLoggedIn(true);
          toast.success(loginUser.mes);
          navigate(path.HOME);
        }
      } else {
        setEmail(response.email);
        setIsSendEmail(true);
      }
    } catch (error) {
      toast.error(error.response.data.mes);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitInGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const response = await apis.getCredentialsFromAccessToken(
        tokenResponse.access_token
      );

      if (response.status === 200) {
        setGoogleData({
          email: response.data.email,
          avatarUrl: response.data.picture,
          displayName: response.data.name,
          verified: response.data.verified_email,
        });

        const user = await apis.checkNewUserFromEmail(response.data.email);

        if (user.hasUser) {
          toast.success("Đăng nhập thành công.");
          setToken(user.token);
          setIsLoggedIn(true);
          setGoogleData(null);
          navigate(path.HOME);
        } else setIsSetupPassword(true);
      }
    },
    onError: (err) => toast.error(err),
  });

  return (
    <>
      {/* Setup user login width google */}
      <DialogSetupPassword
        open={isSetupPassword}
        onOpenChange={setIsSetupPassword}
      />
      {/* send email verify */}
      <DialogSendEmail
        open={isSendEmail}
        onOpenChange={setIsSendEmail}
        setShowFinalRegister={setShowFinalRegister}
      />
      {/* final register */}
      <FinalRegister
        open={showFinalRegister}
        onOpenChange={setShowFinalRegister}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormInput
            form={form}
            lable="Tên người dùng"
            name="userName"
            placeholder="Tên người dùng..."
          />
          <FormPassword
            form={form}
            lable="Mật khẩu"
            name="password"
            placeholder="Mật khẩu..."
          />
          <div className="w-full flex items-center justify-end">
            <Link
              to={`/${path.AUTH}/${path.FORGOT_PASSWORD}`}
              className="hover:underline text-sm"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <LoadingButton loading={isLoading} type="submit" className="w-full">
            Đăng nhập
          </LoadingButton>
        </form>
        <div className="flex items-center space-x-1">
          <div className="border-t flex-1 border-primary/30" />
          <span>or</span>
          <div className="border-t flex-1 border-primary/30" />
        </div>
        <Button
          onClick={handleSubmitInGoogle}
          variant="outline"
          className={"w-full border-primary space-x-2"}
        >
          <GoogleIcon className={"size-6"} />
          <span>Đăng nhập bằng google</span>
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;

const GoogleIcon = ({ size, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size ?? 40}
      height={size ?? 40}
      viewBox="0 0 48 48"
      className={cn(className)}
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></path>
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></path>
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
    </svg>
  );
};

const DialogSetupPassword = ({ open, onOpenChange }) => {
  const { googleData, setGoogleData, setIsLoggedIn, setToken } =
    useCurrentStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(setPassword),
    defaultValues: {
      password: "",
      confirmPassword: "",
      userName: "",
    },
  });

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = { ...data, ...googleData };

    try {
      setIsLoading(true);
      const response = await apis.loginWithGoogle(payload);
      if (response.success) {
        toast.success(response.mes);
        setToken(response.token);
        setIsLoggedIn(true);
        setGoogleData(null);
        onOpenChange(false);
        navigate(path.HOME);
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
          <DialogTitle>Thiết lập tài khoản</DialogTitle>
          <DialogDescription>
            Đây là tài khoản mới. Vui lòng điền đầy đủ thông tin cho tài khoản
            của bạn
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 border-t py-3"
            >
              <FormInput
                form={form}
                lable="Tên người dùng"
                name="userName"
                placeholder="Tên người dùng..."
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
                className="w-full"
              >
                Thiết lập
              </LoadingButton>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const DialogSendEmail = ({ open, onOpenChange, setShowFinalRegister }) => {
  const { email } = useCurrentStore();
  const [isLoading, setIsLoading] = useState(false);

  const handelSendEmail = async () => {
    try {
      setIsLoading(true);
      const response = await apis.sendOtp(email);
      if (response.success) {
        toast.success(response.mes);
        setShowFinalRegister(true);
        onOpenChange();
      }
    } catch (error) {
      toast.error(error.response.data.mes);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-3">
        <DialogHeader>
          <DialogTitle>Gửi email xác minh tài khoản</DialogTitle>
          <DialogDescription>
            Tài khoản này chưa được xác minh vui lòng xác minh trước khi đăng
            nhập
          </DialogDescription>
        </DialogHeader>
        <Input
          type={"email"}
          id={"email"}
          placeholder="Địa chỉ email..."
          value={email}
          disabled
        />
        <LoadingButton
          loading={isLoading}
          onClick={handelSendEmail}
          className="w-full"
        >
          Gửi email
        </LoadingButton>
      </DialogContent>
    </Dialog>
  );
};
