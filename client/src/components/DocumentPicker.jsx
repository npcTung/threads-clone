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
import { useSendMessageDocumentMutation } from "./chats/mutation";

const DocumentPicker = ({ open, onOpenChange, recipientId }) => {
  const [files, setFiles] = useState([]);
  const mutation = useSendMessageDocumentMutation();

  const handleSumbit = () => {
    if (files.length <= 10) {
      const payload = { document: files[0], recipientId };
      mutation.mutate(payload, { onSuccess: onClose });
    } else toast.warning("Số lượng file không được vượt quá 10.");
  };

  const onClose = () => {
    onOpenChange(false);
    setFiles([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chọn tập tin để gửi</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="size-full space-y-5">
          <FileDrop
            className={"rounded-md bg-muted shadow-md"}
            acceptedFiles=".pdf,.ppt,.doc,.docx,.xls,.xlsx,.txt,.csv,.fig"
            setFiles={setFiles}
            files={files}
          />

          <LoadingButton
            variant="outline"
            loading={mutation.isPending}
            disabled={files.length === 0 || mutation.isPending}
            className="bg-muted w-full"
            onClick={handleSumbit}
          >
            Gửi
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPicker;
