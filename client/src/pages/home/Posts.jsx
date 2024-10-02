import {
  HeaderPost,
  // InfiniteScrollContainer,
  LoadingScreen,
  Post,
} from "@/components";
import icons from "@/lib/icons";
import usePostsStore from "@/zustand/usePostsStore";
import React, { useEffect, useState } from "react";

const { LoaderCircle } = icons;

const Posts = () => {
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const { postFeeds, getFeedPosts, isLoading, sortPost, nextCursor } =
    usePostsStore();

  // const fetchNextPage = async () => {
  //   setIsFetching(true);
  //   try {
  //     if (isFetching || !hasNextPage) return;
  //     getFeedPosts(nextCursor);
  //     setHasNextPage(!!nextCursor);
  //   } catch (error) {
  //     console.error(error.message);
  //   } finally {
  //     setIsFetching(false);
  //   }
  // };

  useEffect(() => {
    // fetchNextPage();
    getFeedPosts();
  }, [sortPost]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="max-w-[720px] w-full mx-auto mb-10 border space-y-5 md:rounded-2xl bg-card">
      <HeaderPost />
      {/* <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isLoading && fetchNextPage()}
      > */}
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
      {isFetching && <LoaderCircle className="mx-auto animate-spin" />}
      {/* </InfiniteScrollContainer> */}
    </div>
  );
};

export default Posts;
