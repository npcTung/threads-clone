import icons from "@/lib/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  UserAvatar,
  UserTooltip,
} from "..";
import { vi } from "date-fns/locale";
import { formatDate } from "date-fns";
import { formatRelativeDate, formmatNumber } from "@/lib/utils";

const { ChevronRight, Dot, Heart, Ellipsis, SquarePen, Trash2 } = icons;

const Comments = ({ datas }) => {
  const [showDeteteComment, setShowDeteteComment] = useState(false);
  return (
    <>
      {/* delete comment */}
      <DialogDeleteComment
        open={showDeteteComment}
        onOpenChange={() => setShowDeteteComment(false)}
      />
      <div className="w-full flex flex-col space-y-5">
        <div className="flex justify-between items-center p-5 border-b">
          <span>Thread trả lời</span>
          <div className="flex items-center gap-1 text-sm opacity-50 cursor-pointer">
            <span>Xem hoạt động</span>
            <ChevronRight className="size-5" />
          </div>
        </div>
        {datas.map((data) => (
          <Comment
            key={data.id}
            data={data}
            setShowDeletecomment={() => setShowDeteteComment(true)}
          />
        ))}
      </div>
    </>
  );
};

export default Comments;

const Comment = ({ data, setShowDeletecomment }) => {
  return (
    <div className={"w-full flex items-center justify-between p-5 border-b"}>
      <div className="flex gap-3 w-full">
        <div className="flex flex-col items-center">
          <Link to={`/${data.user.userName}`}>
            <UserAvatar avatarUrl={data.user.avatarUrl} />
          </Link>
        </div>
        <div className="flex-1 w-full space-y-5">
          <div className="flex flex-col">
            <div className="flex justify-between w-full">
              <div className="flex w-full items-center">
                <UserTooltip user={data.user}>
                  <Link
                    to={`/${data.user.userName}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {data.user.userName}
                  </Link>
                </UserTooltip>
                <Dot />
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <small className="opacity-50 cursor-default">
                        {formatRelativeDate(data.createdAt)}
                      </small>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start">
                      {formatDate(data.createdAt, "EEEE, d MMMM, yyyy, HH:mm", {
                        locale: vi,
                      })}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <DropComment
                postId={data.id}
                setShowDeletecomment={setShowDeletecomment}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{data.comment}</span>
              <div className="flex w-fit gap-1 items-center cursor-pointer rounded-full hover:bg-muted p-2">
                <Heart className="size-5" />
                <small>{formmatNumber(data.likes)}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DropComment = ({ setShowDeletecomment }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Ellipsis className="cursor-pointer size-7 p-1 rounded-full hover:bg-muted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="rigth" align="start">
        <DropdownMenuItem className="flex items-center justify-between gap-5 cursor-pointer">
          <span>Sửa</span>
          <SquarePen className="size-5" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center justify-between gap-5 cursor-pointer text-red-600"
          onClick={setShowDeletecomment}
        >
          <span>Xóa</span>
          <Trash2 className="size-5" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DialogDeleteComment = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa bình luận</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn xóa bình luận này?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Hủy</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => console.log("Delete comment.")}
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
