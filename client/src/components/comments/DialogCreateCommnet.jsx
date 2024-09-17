import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import "./styles.css";
import { user } from "@/data";
import { EditPost, UserAvatar } from "..";

const DialogCreateCommnet = ({ open, onOpenChange, userName }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bold: false, italic: false }),
      Placeholder.configure({ placeholder: `Trả lời ${userName}` }),
    ],
  });

  const input = editor?.getText({ blockSeparator: "\n" }) || "";

  const handleSubmit = () => {
    console.log(input);
    onClose();
  };

  const onClose = () => {
    onOpenChange();
    editor.commands.clearContent();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={"max-sm:size-full md:w-[80vh] max-w-none"}>
        <DialogHeader>
          <DialogTitle>Bình luận</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="flex items-start justify-between gap-3">
          <UserAvatar avatarUrl={user.avatarUrl} />
          <div className="flex-1 w-full space-y-5">
            <div className="flex flex-col">
              <div className="flex justify-between w-full">
                <div className="flex w-full items-center">
                  <span className="text-sm font-medium cursor-default">
                    {user.userName}
                  </span>
                </div>
              </div>
              <EditPost editor={editor} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!input.trim()}
            variant="outline"
            onClick={handleSubmit}
          >
            Đăng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateCommnet;
