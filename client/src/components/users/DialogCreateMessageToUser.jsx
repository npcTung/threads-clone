import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "../ui";
import { LoadingButton } from "..";
import { sendMessage } from "./actions";
import { useNavigate } from "react-router-dom";
import path from "@/lib/path";

const DialogCreateMessageToMessage = ({ open, onOpenChange, recipientId }) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = { recipientId, content: input };
      const newMessage = await sendMessage(payload);
      if (newMessage.success) {
        onOpenChange(false);
        setInput("");
        navigate(`/${path.MESSAGER}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo tin nhắ mới</DialogTitle>
          <DialogDescription>
            Bạn chưa có cuộc trò truyện nào với người này. Vui lòng nhập tin
            nhắn để bắt đầu cuộc trò chuyện.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Nhập tin nhắn..."
          className="w-full rounded-md bg-muted"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <DialogFooter>
          <LoadingButton
            variant="outline"
            loading={isLoading}
            disabled={isLoading || !input.trim()}
            onClick={handleSubmit}
          >
            Tạo tin nhắn
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateMessageToMessage;
