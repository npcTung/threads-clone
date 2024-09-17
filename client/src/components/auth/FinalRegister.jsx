import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

const FinalRegister = ({ open, onOpenChange }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleOtpChange = () => {
    console.log(otp);
    setOtp("");
    onOpenChange();
    navigate(`/${path.AUTH}/${path.LOGIN}`);
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
        <div className="w-full flex items-center justify-center space-y-5">
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
        </div>
        <LoadingButton onClick={handleOtpChange}>Gửi</LoadingButton>
      </DialogContent>
    </Dialog>
  );
};

export default FinalRegister;
