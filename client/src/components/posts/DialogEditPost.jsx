import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui";
import { MediaPreviews } from ".";
import { EditInput, LoadingButton, UserAvatar } from "..";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import icons from "@/lib/icons";
import useCurrentStore from "@/zustand/useCurrentStore";
import { toast } from "sonner";
import { convertFile } from "@/lib/utils";
import { useUpdatePostMutation } from "./mutations";

const { ImagePlus } = icons;

const DialogEditPost = ({ open, onOpenChange, data }) => {
  const [files, setFiles] = useState([]);
  const [attachments, setAttachments] = useState(data.fileUrls);
  const { currentData } = useCurrentStore();
  const maxSize = 50 * 1024 * 1024;
  const mutation = useUpdatePostMutation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bold: false, italic: false }),
      Placeholder.configure({ placeholder: "Có gì mới?" }),
    ],
    content: `<p>${data.context}</p>`,
  });

  const input = editor?.getText({ blockSeparator: "\n" }) || "";

  const handleAddFiles = async (files) => {
    const fileArray = [];
    for (let file of files) {
      if (file.type.split("/") === "image" && file.type.split("/") === "video")
        return toast.warning(
          "Định dạng file không hợp lệ. Chỉ nhận file dạng image/video"
        );
      const base64 = await convertFile(file);
      fileArray.push({
        type: file.type.split("/")[0].toUpperCase(),
        url: base64,
      });
    }
    if (fileArray.length) setAttachments(fileArray);
  };

  const handleSubmit = async () => {
    if (files.length <= 10 && input.trim()) {
      let size = 0;
      for (let file of files) size += file.size;
      if (size > maxSize)
        return toast.warning("Dung lượng file quá lớn (không quá 50mb).");

      const payload = {
        context: input,
        files: files?.length ? Array.from(files) : [],
      };
      mutation.mutate(
        { postId: data._id, payload },
        { onSuccess: () => onOpenChange(false) }
      );
    } else
      toast.warning(
        files.length > 10 && "Số lượng file không được vượt quá 10."
      );
  };

  useEffect(() => {
    if (files.length) handleAddFiles(files);
  }, [files]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={"max-sm:size-full md:w-[80vh] max-w-none"}>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="flex items-start justify-between gap-3">
          <UserAvatar avatarUrl={currentData?.avatarUrl} />
          <div className="flex-1 w-full space-y-5">
            <div className="flex flex-col space-y-5">
              <div className="flex justify-between w-full">
                <div className="flex w-full items-center">
                  <span className="text-sm font-medium cursor-default">
                    {currentData?.userName}
                  </span>
                </div>
              </div>
              <EditInput
                editor={editor}
                className={"max-h-[10rem] max-w-[752px] px-5 py-3"}
              />
              {attachments.length > 0 && (
                <MediaPreviews attachments={attachments} />
              )}
              <label htmlFor="attachments" className="w-fit">
                <input
                  type="file"
                  id="attachments"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
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
            loading={mutation.isPending}
            variant="outline"
            onClick={handleSubmit}
          >
            Chỉnh sửa
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditPost;
