import {
  Comments,
  DialogCreateCommnet,
  DialogDeletePost,
  DialogEditPost,
  DialogMedias,
  DropPost,
  LoadingScreen,
  MediaPreviews,
  NotFound,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  UserAvatar,
  UserTooltip,
} from "@/components";
import icons from "@/lib/icons";
import { cn, formatRelativeDate, formmatNumber } from "@/lib/utils";
import useCurrentStore from "@/zustand/useCurrentStore";
import { formatDate } from "date-fns";
import { vi } from "date-fns/locale";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDetialPost } from "./actions";
import { useLikePostMutation } from "@/components/posts/mutations";

const { Dot, Heart, MessageSquare } = icons;

const PostDetail = () => {
  const [showMedia, setShowMedia] = useState(false);
  const [showDeletePost, setShowDeletePost] = useState(false);
  const [showCreateCommnet, setShowCreateCommnet] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const { currentData } = useCurrentStore();
  const { post_id } = useParams();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["detail-post", post_id],
    queryFn: () => getDetialPost(post_id),
    staleTime: 5000,
  });

  if (isLoading) return <LoadingScreen />;

  if (error) return <NotFound />;

  return (
    <>
      {/* show medias */}
      {post?.fileUrls?.length > 0 && (
        <DialogMedias
          open={showMedia}
          onOpenChange={setShowMedia}
          attachments={post.fileUrls}
        />
      )}
      {/* delete post */}
      <DialogDeletePost
        open={showDeletePost}
        onOpenChange={setShowDeletePost}
        postId={post._id}
      />
      {/* comment post */}
      <DialogCreateCommnet
        data={currentData}
        onOpenChange={setShowCreateCommnet}
        open={showCreateCommnet}
        postId={post._id}
      />
      {/* edit post */}
      <DialogEditPost
        data={post}
        onOpenChange={setShowEditPost}
        open={showEditPost}
      />
      <div className="max-w-[720px] mx-auto mb-5 border md:rounded-2xl bg-card">
        <PostHeader
          data={post}
          setShowDeletePost={setShowDeletePost}
          setShowMedia={setShowMedia}
          setShowCreateCommnet={setShowCreateCommnet}
          setShowEditPost={setShowEditPost}
          currentData={currentData}
        />
        <Comments postId={post._id} />
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
  currentData,
  setShowEditPost,
}) => {
  const isLike = data.likes.includes(currentData._id);
  const mutation = useLikePostMutation();

  return (
    <div className={"w-full flex items-center justify-between p-5"}>
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col space-y-3 w-full">
          <div className="flex justify-between gap-5 w-full">
            <Link to={`/${data.postedBy.userName}`}>
              <UserAvatar avatarUrl={data.postedBy.avatarUrl} />
            </Link>
            <div className="flex w-full items-center">
              <UserTooltip user={data.postedBy}>
                <Link
                  to={`/${data.postedBy.userName}`}
                  className="text-sm font-medium hover:underline"
                >
                  {data.postedBy.userName}
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
            <DropPost
              postId={data._id}
              setDeletePost={setShowDeletePost}
              isEdit={data.postedBy._id === currentData._id}
              setEditPost={setShowEditPost}
            />
          </div>
          <span className="text-sm">{data.context}</span>
          <MediaPreviews
            attachments={data.fileUrls}
            onOpenChange={setShowMedia}
          />
          <div className="flex gap-3 mt-1 border-b">
            <div
              className="flex gap-1 items-center cursor-pointer rounded-full hover:bg-muted p-2"
              onClick={() => mutation.mutate(data._id)}
            >
              <Heart
                className={cn("size-5", isLike && "fill-red-500 text-red-500")}
              />
              <small>{formmatNumber(data.likes.length)}</small>
            </div>
            <div
              className="flex gap-1 items-center cursor-pointer rounded-full hover:bg-muted p-2"
              onClick={setShowCreateCommnet}
            >
              <MessageSquare className="size-5" />
              <small>{formmatNumber(data.totalCountComment || 0)}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
