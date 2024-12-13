import {
  FollowerCount,
  InfiniteScrollContainer,
  Input,
  UserAvatar,
  UserTooltip,
  useTheme,
} from "@/components";
import icons from "@/lib/icons";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGetUsers } from "./actions";

const { SearchIcon, LoaderCircle } = icons;

const Search = () => {
  const [queries, setQueries] = useState({ q: null });
  const queriesDebounce = useDebounce(queries, 800);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
  } = useInfiniteQuery({
    queryKey: ["search", queriesDebounce],
    queryFn: ({ pageParam }) => fetchGetUsers(queriesDebounce, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    staleTime: 5000,
  });

  const users = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="max-w-[720px] w-full p-5 mx-auto mb-10 border space-y-5 md:rounded-2xl bg-card">
      <SearchField setQueries={setQueries} />
      <InfiniteScrollContainer
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
        <div>
          <span className="font-semibold text-sm opacity-50">
            Gợi ý theo dõi
          </span>
        </div>
        <UserPreviews datas={users} />
        {status === "success" && !users.length && !hasNextPage && (
          <span>Không có người dùng nào.</span>
        )}
        {isFetchingNextPage && (
          <LoaderCircle className="mx-auto size-5 animate-spin" />
        )}
      </InfiniteScrollContainer>
    </div>
  );
};

export default Search;

const SearchField = ({ setQueries }) => {
  const { theme } = useTheme();

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      <Input
        placeholder="Search"
        onChange={(e) => setQueries({ q: e.target.value.trim() || null })}
        className={cn("ps-10", theme === "dark" ? "bg-background" : "bg-muted")}
      />
    </div>
  );
};

const UserPreviews = ({ datas }) => {
  const navigate = useNavigate();

  return (
    <div>
      {datas?.length &&
        datas.map((data) => (
          <div
            className={"w-full flex items-center justify-between p-5"}
            key={data._id}
          >
            <div className="flex gap-3 w-full">
              <div className="flex flex-col items-center">
                <Link to={`/${data.userName}`}>
                  <UserAvatar
                    avatarUrl={data.avatarUrl}
                    displayName={data.displayName}
                  />
                </Link>
              </div>
              <div
                className="flex-1 w-full space-y-5 border-b pb-2 cursor-pointer"
                onClick={() => navigate(`/${data.userName}`)}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between w-full">
                    <div className="flex w-full items-center">
                      <UserTooltip user={data}>
                        <span className="text-sm font-medium hover:underline">
                          {data.userName}
                        </span>
                      </UserTooltip>
                    </div>
                  </div>
                  <span className="text-sm opacity-50">{data.displayName}</span>
                </div>
                <FollowerCount
                  className={"text-sm"}
                  follower={data.follower.length}
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
