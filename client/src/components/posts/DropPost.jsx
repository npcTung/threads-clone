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
import { toast } from "sonner";
import { useBookmarkPostUser } from "@/hooks/useCurrentData";

const { Ellipsis, Bookmark, Link2, SquarePen, Trash2, BookmarkCheck } = icons;

const DropPost = ({
  postId,
  setDeletePost,
  isEdit,
  setEditPost,
  isCheckBookMark,
}) => {
  const bookmark = useBookmarkPostUser();

  const copyUrl = () => {
    const url = `${window.location.origin}/${path.POSTS}/${postId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Đã sao chép url.");
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Ellipsis className="cursor-pointer size-7 p-1 rounded-full hover:bg-muted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="rigth" align="start">
        <DropdownMenuItem
          className="flex items-center justify-between gap-5 cursor-pointer"
          onClick={() => bookmark.bookmarkPostUser(postId)}
        >
          <span>{isCheckBookMark ? "Đã lưu" : "Lưu"}</span>
          {isCheckBookMark ? (
            <BookmarkCheck className="size-5" />
          ) : (
            <Bookmark className="size-5" />
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center justify-between gap-5 cursor-pointer"
          onClick={copyUrl}
        >
          <span>Sao chép liên kết</span>
          <Link2 className="size-5 -rotate-45" />
        </DropdownMenuItem>
        {isEdit && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center justify-between gap-5 cursor-pointer"
              onClick={setEditPost}
            >
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
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropPost;
