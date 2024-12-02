import icons from "@/lib/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogEditComment,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  InfiniteScrollContainer,
  LoadingButton,
  LoadingScreen,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  UserAvatar,
  UserTooltip,
} from "..";
import { vi } from "date-fns/locale";
import { formatDate } from "date-fns";
import { cn, formatRelativeDate, formmatNumber } from "@/lib/utils";
import useCurrentStore from "@/zustand/useCurrentStore";
import { getAllCommentsPost } from "./actions";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDeleteCommentMutation, useLikeCommentMutation } from "./mutations";

const { ChevronRight, Dot, Heart, Ellipsis, SquarePen, Trash2, LoaderCircle } =
  icons;

const Comments = ({ postId }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) => getAllCommentsPost(postId, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    staleTime: 5000,
  });

  const datas = data?.pages.find((comment) => comment);

  if (status === "pending") return <LoadingScreen />;

  if (status === "success" && !datas?.comments?.length && !hasNextPage)
    return (
      <div className="p-5 flex items-center justify-center">
        <span className="text-center">Không có bình luận nào.</span>
      </div>
    );

  if (status === "error")
    return (
      <div className="p-5 flex items-center justify-center">
        <span className="text-center text-destructive">
          Đã xảy ra lỗi khi tải bình luận.
        </span>
      </div>
    );

  return (
    <>
      <div className="w-full flex flex-col space-y-5">
        <div className="flex justify-between items-center p-5 border-b">
          <span>Thread trả lời</span>
          <div className="flex items-center gap-1 text-sm opacity-50 cursor-pointer">
            <span>Xem hoạt động</span>
            <ChevronRight className="size-5" />
          </div>
        </div>
        <InfiniteScrollContainer
          onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
        >
          {datas?.comments.map((data) => (
            <Comment key={data._id} data={data} postId={postId} />
          ))}
          {isFetchingNextPage && (
            <LoaderCircle className="mx-auto size-5 animate-spin" />
          )}
        </InfiniteScrollContainer>
      </div>
    </>
  );
};

export default Comments;

const Comment = ({ data, postId }) => {
  const [showDeteteComment, setShowDeteteComment] = useState(false);
  const [showEditComment, setShowEditComment] = useState(false);
  const { currentData } = useCurrentStore();
  const isLike = data.likes.includes(currentData._id);
  const mutation = useLikeCommentMutation(postId);

  return (
    <>
      {/* delete comment */}
      <DialogDeleteComment
        open={showDeteteComment}
        onOpenChange={() => setShowDeteteComment(false)}
        postId={postId}
        commentId={data._id}
      />
      {/* edit comment */}
      <DialogEditComment
        commentId={data._id}
        context={data.context}
        data={currentData}
        onOpenChange={setShowEditComment}
        open={showEditComment}
        postId={postId}
      />
      <div className={"w-full flex items-center justify-between p-5 border-b"}>
        <div className="flex gap-3 w-full">
          <div className="flex flex-col items-center">
            <Link to={`/${data.userId.userName}`}>
              <UserAvatar avatarUrl={data.userId.avatarUrl} />
            </Link>
          </div>
          <div className="flex-1 w-full space-y-5">
            <div className="flex flex-col">
              <div className="flex justify-between w-full">
                <div className="flex w-full items-center">
                  <UserTooltip user={data.userId}>
                    <Link
                      to={`/${data.userId.userName}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {data.userId.userName}
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
                        {formatDate(
                          data.createdAt,
                          "EEEE, d MMMM, yyyy, HH:mm",
                          {
                            locale: vi,
                          }
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {data.userId._id === currentData._id && (
                  <DropComment
                    setShowDeletecomment={setShowDeteteComment}
                    setShowEditComment={setShowEditComment}
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{data.context}</span>
                <div
                  className="flex w-fit gap-1 items-center cursor-pointer rounded-full hover:bg-muted p-2"
                  onClick={() => mutation.mutate(data._id)}
                >
                  <Heart
                    className={cn(
                      "size-5",
                      isLike && "fill-red-500 text-red-500"
                    )}
                  />
                  <small>{formmatNumber(data.likes.length)}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const DropComment = ({ setShowDeletecomment, setShowEditComment }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Ellipsis className="cursor-pointer size-7 p-1 rounded-full hover:bg-muted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="rigth" align="start">
        <DropdownMenuItem
          className="flex items-center justify-between gap-5 cursor-pointer"
          onClick={setShowEditComment}
        >
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

const DialogDeleteComment = ({ open, onOpenChange, postId, commentId }) => {
  const mutation = useDeleteCommentMutation(postId);

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
          <LoadingButton
            variant="destructive"
            loading={mutation.isPending}
            onClick={() =>
              mutation.mutate(commentId, { onSuccess: onOpenChange(false) })
            }
          >
            Xóa
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
