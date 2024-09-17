import {
  Comments,
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
} from "@/components";
import { dataComments, dataPost } from "@/data";
import icons from "@/lib/icons";
import { formatRelativeDate, formmatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { vi } from "date-fns/locale";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const { Dot, Heart, MessageCircle } = icons;

const PostDetail = () => {
  const [showMedia, setShowMedia] = useState(false);
  const [showDeletePost, setShowDeletePost] = useState(false);
  const [showCreateCommnet, setShowCreateCommnet] = useState(false);

  return (
    <>
      {/* show medias */}
      <DialogMedias
        open={showMedia}
        onOpenChange={() => setShowMedia(false)}
        attachments={dataPost.imageUrl}
      />
      {/* delete post */}
      <DialogDeletePost
        open={showDeletePost}
        onOpenChange={() => setShowDeletePost(false)}
      />
      {/* comment post */}
      <DialogCreateCommnet
        userName={dataPost.user.userName}
        onOpenChange={() => setShowCreateCommnet(false)}
        open={showCreateCommnet}
      />
      <div className="w-[720px] mx-auto my-10 border min-h-full md:rounded-2xl">
        <PostHeader
          data={dataPost}
          setShowDeletePost={() => setShowDeletePost(true)}
          setShowMedia={() => setShowMedia(true)}
          setShowCreateCommnet={() => setShowCreateCommnet(true)}
        />
        <Comments datas={dataComments} />
      </div>
    </>
  );
};

export default PostDetail;

const PostHeader = ({
  data,
  setShowDeletePost,
  setShowMedia,
  setShowCreateCommnet,
}) => {
  return (
    <div className={"w-full flex items-center justify-between p-5"}>
      <div className="flex flex-col items-center">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between gap-5 w-full">
            <Link to={`/${data.user.userName}`}>
              <UserAvatar avatarUrl={data.user.avatarUrl} />
            </Link>
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
                    <small className="cursor-default opacity-50">
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
            <DropPost postId={data.id} setDeletePost={setShowDeletePost} />
          </div>
          <span className="text-sm">{data.context}</span>
          <MediaPreviews
            attachments={data.imageUrl}
            onOpenChange={setShowMedia}
          />
          <div className="flex gap-3 mt-1 border-b">
            <div className="flex gap-1 items-center cursor-pointer rounded-full hover:bg-muted p-2">
              <Heart className="size-5" />
              <small>{formmatNumber(data.likes)}</small>
            </div>
            <div
              className="flex gap-1 items-center cursor-pointer rounded-full hover:bg-muted p-2"
              onClick={setShowCreateCommnet}
            >
              <MessageCircle className="size-5" />
              <small>{formmatNumber(data.comments)}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
