import { signUpSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  FinalRegister,
  Form,
  FormInput,
  FormPassword,
  LoadingButton,
} from "..";
import icons from "@/lib/icons";
import * as apis from "@/apis";
import { toast } from "sonner";
import useCurrentStore from "@/zustand/useCurrentStore";

const { AlertCircle } = icons;

const SignUpForm = () => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showFinalRegister, setShowFinalRegister] = useState(false);
  const { setEmail } = useCurrentStore();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    },
  });

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = data;

    try {
      setIsLoading(true);
      const response = await apis.register(payload);
      if (response.success) {
        setEmail(payload.email);
        toast.success(response.mes);
        setShowFinalRegister(true);
      }
    } catch (error) {
      setError(error.response.data.mes);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FinalRegister
        open={showFinalRegister}
        onOpenChange={() => setShowFinalRegister(false)}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {error && (
            <Alert variant={"destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex w-full items-center justify-between space-x-2">
            <FormInput
              lable="Tên người dùng"
              form={form}
              name="userName"
              placeholder="Tên người dùng..."
            />
            <FormInput
              lable="Họ và tên"
              form={form}
              name="displayName"
              placeholder="Họ và tên..."
            />
          </div>
          <FormInput
            lable="Địa chỉ email"
            form={form}
            name="email"
            placeholder="Địa chỉ email..."
          />
          <FormPassword
            lable="Mật khẩu"
            form={form}
            name="password"
            placeholder="Mật khẩu..."
          />
          <FormPassword
            lable="Nhập lại mật khẩu"
            form={form}
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu..."
          />
          <LoadingButton loading={isLoading} type="submit" className="w-full">
            Tạo tài khoản
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};

export default SignUpForm;
