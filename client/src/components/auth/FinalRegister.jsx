import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../ui";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { LoadingButton } from "..";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import path from "@/lib/path";
import * as apis from "@/apis";
import { toast } from "sonner";
import useCurrentStore from "@/zustand/useCurrentStore";
import icons from "@/lib/icons";

const { RotateCcw } = icons;

const FinalRegister = ({ open, onOpenChange }) => {
  const [otp, setOtp] = useState("");
  const { email, setEmail, setIsLoggedIn, setToken } = useCurrentStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSendOtp, setIsSendOtp] = useState(false);

  const handleOtpChange = async () => {
    try {
      setIsLoading(true);
      const response = await apis.verifyOtp({ otp, email });
      if (response.success) {
        toast.success(response.mes);
        setIsLoggedIn(true);
        setToken(response.token);
        setOtp("");
        setEmail(null);
        onOpenChange();
        navigate(path.HOME);
      }
    } catch (error) {
      toast.error(error.response.data.mes);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsSendOtp(true);
    try {
      const sendOtp = await apis.sendOtp(email);
      if (sendOtp.success) toast.success(sendOtp.mes);
      else toast.error(sendOtp.mes);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsSendOtp(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hoàn tất đăng ký</DialogTitle>
          <DialogDescription>
            Nhập code đã được gửi về gmail đã đăng ký của bạn.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col items-center justify-center space-y-5">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="otp-slot" />
              <InputOTPSlot index={1} className="otp-slot" />
              <InputOTPSlot index={2} className="otp-slot" />
              <InputOTPSlot index={3} className="otp-slot" />
              <InputOTPSlot index={4} className="otp-slot" />
              <InputOTPSlot index={5} className="otp-slot" />
            </InputOTPGroup>
          </InputOTP>
          <div className="flex flex-row items-center space-x-1">
            <span className="text-xs">
              Nếu bạn không nhận code, vui lòng kiểm tra hộp thư.
            </span>
            <Button
              variant="link"
              className="space-x-1 p-0 text-xs underline"
              onClick={handleResendOtp}
              disabled={isSendOtp}
            >
              <span>Gửi lại</span> <RotateCcw className="size-3" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <LoadingButton
            loading={isLoading}
            onClick={handleOtpChange}
            className={"w-full"}
          >
            Gửi
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FinalRegister;
