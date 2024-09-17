import { useToast } from "@/hooks/use-toast";
import path from "@/lib/path";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui";
import icons from "@/lib/icons";

const { Ellipsis, Bookmark, Link2, SquarePen, Trash2 } = icons;

const DropPost = ({ postId, setDeletePost }) => {
  const { toast } = useToast();

  const copyUrl = () => {
    const url = `${window.location.origin}/${path.POSTS}/${postId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        variant: "default",
        title: "Successfully copied.",
        description: "Post copied url.",
        duration: 3000,
        className: "bg-green-600 text-white border-green-600",
      });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Ellipsis className="cursor-pointer size-7 p-1 rounded-full hover:bg-muted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="rigth" align="start">
        <DropdownMenuItem className="flex items-center justify-between gap-5 cursor-pointer">
          <span>Lưu</span>
          <Bookmark className="size-5" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center justify-between gap-5 cursor-pointer"
          onClick={copyUrl}
        >
          <span>Sao chép liên kết</span>
          <Link2 className="size-5" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center justify-between gap-5 cursor-pointer">
          <span>Sửa</span>
          <SquarePen className="size-5" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center justify-between gap-5 cursor-pointer text-red-600"
          onClick={setDeletePost}
        >
          <span>Xóa</span>
          <Trash2 className="size-5" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropPost;
