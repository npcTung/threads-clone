import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui";
import { EditPost, MediaPreviews } from ".";
import { user } from "@/data";
import { LoadingButton, UserAvatar } from "..";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import icons from "@/lib/icons";

const { ImagePlus } = icons;

const DialogCreatePost = ({ open, onOpenChange }) => {
  const [images, setImages] = useState(null);
  const [attachments, setAttachments] = useState([{ type: "", url: [] }]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bold: false, italic: false }),
      Placeholder.configure({ placeholder: "Có gì mới?" }),
    ],
  });

  const input = editor?.getText({ blockSeparator: "\n" }) || "";

  const handleSubmit = () => {
    if (images.length <= 10 && input.trim()) {
      const payload = {
        content: input,
        images: images?.length > 0 ? Array.from(images) : [],
      };
      console.log(payload);
    }
  };

  const onClose = () => {
    onOpenChange();
    setImages(null);
    setAttachments([]);
    editor.commands.clearContent();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={"max-sm:size-full md:w-[80vh] max-w-none"}>
        <DialogHeader>
          <DialogTitle>Tạo bài viết</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="flex items-start justify-between gap-3">
          <UserAvatar avatarUrl={user.avatarUrl} />
          <div className="flex-1 w-full space-y-5">
            <div className="flex flex-col space-y-5">
              <div className="flex justify-between w-full">
                <div className="flex w-full items-center">
                  <span className="text-sm font-medium cursor-default">
                    {user.userName}
                  </span>
                </div>
              </div>
              <EditPost editor={editor} />
              {attachments.length > 0 && (
                <MediaPreviews attachments={attachments} />
              )}
              <label htmlFor="attachments" className="w-fit">
                <input
                  type="file"
                  id="attachments"
                  multiple
                  onChange={(e) => setImages(e.target.files)}
                  hidden
                />
                <ImagePlus className="size-5 opacity-50 cursor-pointer" />
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <LoadingButton
            disabled={!input.trim()}
            variant="outline"
            onClick={handleSubmit}
          >
            Tạo
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreatePost;
