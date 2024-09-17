import { cn, formatRelativeDate, formmatNumber } from "@/lib/utils";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  DialogCreateCommnet,
  DialogDeletePost,
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

const { Dot, Heart, MessageSquare } = icons;

const Post = ({ className, data }) => {
  const [showMedia, setShowMedia] = useState(false);
  const [showDeletePost, setShowDeletePost] = useState(false);
  const [showCreateCommnet, setShowCreateCommnet] = useState(false);

  return (
    <>
      {/* show medias */}
      <DialogMedias
        open={showMedia}
        onOpenChange={() => setShowMedia(false)}
        attachments={data.imageUrl}
      />
      {/* delete post */}
      <DialogDeletePost
        open={showDeletePost}
        onOpenChange={() => setShowDeletePost(false)}
      />
      {/* comment post */}
      <DialogCreateCommnet
        userName={data.user.userName}
        onOpenChange={() => setShowCreateCommnet(false)}
        open={showCreateCommnet}
      />
      <div
        className={cn(
          "w-full flex items-center justify-between p-5",
          className
        )}
      >
        <div className="flex gap-3 w-full">
          <div className="flex flex-col items-center">
            <Link to={`/${data.user.userName}`}>
              <UserAvatar
                avatarUrl={data.user.avatarUrl}
                displayName={data.user.displayName}
              />
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
                        <Link
                          to={`/${path.POSTS}/${data.id}`}
                          className="opacity-50"
                        >
                          <small>{formatRelativeDate(data.createdAt)}</small>
                        </Link>
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
                <DropPost
                  postId={data.id}
                  setDeletePost={() => setShowDeletePost(true)}
                />
              </div>
              <Link to={`/${path.POSTS}/${data.id}`} className="text-sm">
                {data.context}
              </Link>
            </div>
            <MediaPreviews
              attachments={data.imageUrl}
              onOpenChange={() => setShowMedia(true)}
            />
            <div className="flex gap-3 mt-1">
              <div className="flex gap-1 items-center cursor-pointer rounded-full hover:bg-muted p-2">
                <Heart className="size-5" />
                <small>{formmatNumber(data.likes)}</small>
              </div>
              <div
                className="flex gap-1 items-center cursor-pointer rounded-full hover:bg-muted p-2"
                onClick={() => setShowCreateCommnet(true)}
              >
                <MessageSquare className="size-5" />
                <small>{formmatNumber(data.comments)}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
