import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from "./ui";
import { FileDropZone, LoadingButton } from ".";
import icons from "@/lib/icons";

const { SendHorizontal } = icons;

const MediaPicker = ({ open, onOpenChange }) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSumbit = () => {
    setIsLoading(true);
    const setTimeoutId = setTimeout(() => {
      try {
        console.log({ input });
        setInput("");
        onOpenChange(false);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }, 2000);

    return () => clearTimeout(setTimeoutId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Chọn tập tin & phương tiện để gửi</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="size-full space-y-5">
          <FileDropZone
            className={"rounded-md bg-muted shadow-md"}
            maxFileSize={100 * 1024 * 1024}
          />
          <div className="flex flex-row items-center justify-between space-x-2">
            <Input
              placeholder="Nhập tin nhắn..."
              onChange={(e) => setInput(e.target.value)}
              className="bg-muted"
            />
            <LoadingButton
              variant="outline"
              loading={isLoading}
              disabled={isLoading}
              className="bg-muted"
              onClick={handleSumbit}
            >
              <SendHorizontal className="size-5 -rotate-45" />
            </LoadingButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPicker;
