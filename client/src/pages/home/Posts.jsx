import {
  HeaderPost,
  InfiniteScrollContainer,
  LoadingScreen,
  Post,
} from "@/components";
import icons from "@/lib/icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import useAppStore from "@/zustand/useAppStore";
import { getFeedPosts } from "./actions";

const { LoaderCircle } = icons;

const Posts = () => {
  const { sortPost } = useAppStore();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", sortPost],
    queryFn: ({ pageParam }) => getFeedPosts(pageParam, sortPost),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    staleTime: 5000,
  });

  const postFeeds = data?.pages.flatMap((page) => page?.posts) || [];

  if (status === "pending") return <LoadingScreen />;

  if (status === "success" && !postFeeds.length && !hasNextPage)
    return (
      <div className="p-5 flex items-center justify-center">
        <span className="text-center text-destructive">
          Không có bài viết nào.
        </span>
      </div>
    );

  if (status === "error")
    return (
      <div className="p-5 flex items-center justify-center">
        <span className="text-center text-destructive">
          Đã xảy ra lỗi khi tải bài viết.
        </span>
      </div>
    );

  return (
    <div className="max-w-[720px] w-full mx-auto mb-10 border space-y-5 md:rounded-2xl bg-card">
      <HeaderPost />
      <InfiniteScrollContainer
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
        {postFeeds.map((post, idx) => (
          <Post
            key={idx}
            className={idx !== postFeeds.length - 1 && "border-b"}
            data={post}
          />
        ))}
        {isFetchingNextPage && (
          <LoaderCircle className="mx-auto size-5 animate-spin" />
        )}
      </InfiniteScrollContainer>
    </div>
  );
};

export default Posts;
