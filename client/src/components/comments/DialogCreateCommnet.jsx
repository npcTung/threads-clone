import React from "react";
import {
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
import { EditPost, LoadingButton, UserAvatar } from "..";
import usePostsStore from "@/zustand/usePostsStore";

const DialogCreateCommnet = ({ open, onOpenChange, data, postId }) => {
  const { createCommentPost, isCreateLoading } = usePostsStore();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bold: false, italic: false }),
      Placeholder.configure({ placeholder: `Trả lời ${data.userName}` }),
    ],
  });

  const input = editor?.getText({ blockSeparator: "\n" }) || "";

  const handleSubmit = async () => {
    await createCommentPost(postId, { context: input });
    if (!isCreateLoading) onClose();
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
          <UserAvatar avatarUrl={data.avatarUrl} />
          <div className="flex-1 w-full space-y-5">
            <div className="flex flex-col">
              <div className="flex justify-between w-full">
                <div className="flex w-full items-center">
                  <span className="text-sm font-medium cursor-default">
                    {data.userName}
                  </span>
                </div>
              </div>
              <EditPost editor={editor} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <LoadingButton
            disabled={!input.trim()}
            loading={isCreateLoading}
            variant="outline"
            onClick={handleSubmit}
          >
            Đăng
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateCommnet;
