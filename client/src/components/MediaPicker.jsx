import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui";
import { FileDrop, LoadingButton } from ".";
import { toast } from "sonner";
import { useSendMessageMediasMutation } from "./chats/mutation";

const MediaPicker = ({ open, onOpenChange, recipientId }) => {
  const [images, setImages] = useState([]);
  const mutation = useSendMessageMediasMutation();

  const handleSumbit = () => {
    if (images.length <= 10) {
      const payload = {
        recipientId,
        images,
      };
      mutation.mutate(payload, { onSuccess: onClose });
      onClose();
    } else toast.warning("Số lượng ảnh và video không được vượt quá 10.");
  };

  const onClose = () => {
    onOpenChange(false);
    setImages([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Chọn tập tin & phương tiện để gửi</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="size-full space-y-5">
          <FileDrop
            className={"rounded-md bg-muted shadow-md"}
            maxFileSize={100 * 1024 * 1024}
            setFiles={setImages}
            files={images}
            multiple
          />
          <LoadingButton
            variant="outline"
            loading={mutation.isPending}
            disabled={images.length === 0 || mutation.isPending}
            className="bg-muted w-full flex items-center justify-center space-x-1"
            onClick={handleSumbit}
          >
            <span>Gửi</span>
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPicker;
