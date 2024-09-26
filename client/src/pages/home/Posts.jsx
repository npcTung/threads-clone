import { HeaderPost, LoadingScreen, Post } from "@/components";
import usePostsStore from "@/zustand/usePostsStore";
import React, { useEffect } from "react";

const Posts = () => {
  const { postFeeds, getFeedPosts, isLoading, sortPost } = usePostsStore();

  useEffect(() => {
    getFeedPosts();
  }, [sortPost]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="max-w-[720px] w-full mx-auto mb-10 border space-y-5 md:rounded-2xl bg-card">
      <HeaderPost />
      {postFeeds.length > 0 ? (
        postFeeds.map((post, idx) => (
          <Post
            key={post._id}
            className={idx !== postFeeds.length - 1 && "border-b"}
            data={post}
          />
        ))
      ) : (
        <div className="p-5 flex items-center justify-center">
          <span>Không có bài viết nào</span>
        </div>
      )}
    </div>
  );
};

export default Posts;
