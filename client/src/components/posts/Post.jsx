import { cn, formatRelativeDate, formmatNumber } from "@/lib/utils";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  DialogCreateCommnet,
  DialogDeletePost,
  DialogEditPost,
  DialogMedias,
  DropPost,
  MediaPreviews,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  UserAvatar,
  UserTooltip,
} from "..";
import icons from "@/lib/icons";
import path from "@/lib/path";
import { formatDate } from "date-fns";
import { vi } from "date-fns/locale";
import useCurrentStore from "@/zustand/useCurrentStore";
import { useLikePostMutation } from "./mutations";

const { Dot, Heart, MessageSquare } = icons;

const Post = ({ className, data }) => {
  const [showMedia, setShowMedia] = useState(false);
  const [showDeletePost, setShowDeletePost] = useState(false);
  const [showCreateCommnet, setShowCreateCommnet] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const { currentData } = useCurrentStore();
  const mutation = useLikePostMutation();
  const isLike = data.likes.includes(currentData._id);

  return (
    <>
      {/* show medias */}
      {data?.fileUrls?.length > 0 && (
        <DialogMedias
          open={showMedia}
          onOpenChange={setShowMedia}
          attachments={data.fileUrls}
        />
      )}
      {/* delete post */}
      <DialogDeletePost
        open={showDeletePost}
        onOpenChange={setShowDeletePost}
        postId={data?._id}
      />
      {/* comment post */}
      <DialogCreateCommnet
        data={currentData}
        onOpenChange={setShowCreateCommnet}
        open={showCreateCommnet}
        postId={data._id}
      />
      {/* edit post */}
      <DialogEditPost
        data={data}
        onOpenChange={setShowEditPost}
        open={showEditPost}
      />
      <div
        className={cn(
          "w-full flex items-center justify-between p-5",
          className
        )}
      >
        <div className="flex gap-3 w-full">
          <div className="flex flex-col items-center">
            <Link to={`/${data?.postedBy?.userName}`}>
              <UserAvatar
                avatarUrl={data?.postedBy?.avatarUrl}
                displayName={data?.postedBy?.displayName}
              />
            </Link>
          </div>
          <div className="flex-1 w-full space-y-5">
            <div className="flex flex-col">
              <div className="flex justify-between w-full">
                <div className="flex w-full items-center">
                  <UserTooltip user={data?.postedBy}>
                    <Link
                      to={`/${data?.postedBy?.userName}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {data?.postedBy?.userName}
                    </Link>
                  </UserTooltip>
                  <Dot />
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={`/${path.POSTS}/${data?._id}`}
                          className="opacity-50"
                        >
                          <small>{formatRelativeDate(data?.createdAt)}</small>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="start">
                        {formatDate(
                          data?.createdAt,
                          "EEEE, d MMMM, yyyy, HH:mm",
                          {
                            locale: vi,
                          }
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <DropPost
                  postId={data?._id}
                  setDeletePost={() => setShowDeletePost(true)}
                  setEditPost={() => setShowEditPost(true)}
                  isEdit={data?.postedBy._id === currentData._id}
                  isCheckBookMark={currentData.bookmarkedPosts.includes(
                    data?._id
                  )}
                />
              </div>
              <Link to={`/${path.POSTS}/${data?._id}`} className="text-sm">
                {data?.context}
              </Link>

              {/* Media previews */}
              {data?.fileUrls?.length > 0 && (
                <MediaPreviews
                  attachments={data?.fileUrls}
                  onOpenChange={() => setShowMedia(true)}
                />
              )}
            </div>
            <div className="flex gap-3 mt-1">
              <div
                className="flex gap-1 items-center cursor-pointer rounded-full hover:bg-muted p-2"
                onClick={() => mutation.mutate(data._id)}
              >
                <Heart
                  className={cn(
                    "size-5",
                    isLike && "fill-red-500 text-red-500"
                  )}
                />
                <small>{formmatNumber(data?.likes?.length)}</small>
              </div>
              <div
                className="flex gap-1 items-center cursor-pointer rounded-full hover:bg-muted p-2"
                onClick={() => setShowCreateCommnet(true)}
              >
                <MessageSquare className="size-5" />
                <small>{formmatNumber(data.totalCountComment || 0)}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
