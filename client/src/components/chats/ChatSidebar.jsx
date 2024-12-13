import { cn } from "@/lib/utils";
import React, { useState } from "react";
import {
  Button,
  DialogCreateConversation,
  Divider,
  InfiniteScrollContainer,
  Input,
  ScrollArea,
  Skeleton,
  UserAvatar,
} from "..";
import icons from "@/lib/icons";
import { formatDate } from "date-fns";
import { fetchMarkAsRead, getAllConversations } from "./actions";
import { useInfiniteQuery } from "@tanstack/react-query";
import useCurrentStore from "@/zustand/useCurrentStore";
import useConversationStore from "@/zustand/useConversationStore";
import { useNavigate } from "react-router-dom";
import path from "@/lib/path";
import useDebounce from "@/hooks/useDebounce";
import { socket } from "@/lib/socketConfig";

const { Search, Plus, LoaderCircle, TriangleAlert } = icons;

const ChatSidebar = ({ className }) => {
  const [inputSearch, setInputSearch] = useState({ q: null });
  const queriesDebounce = useDebounce(inputSearch, 800);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["conversations", queriesDebounce],
    queryFn: ({ pageParam }) => getAllConversations(queriesDebounce, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    staleTime: 5000,
  });

  const conversations = data?.pages.flatMap((page) => page.conversations) || [];

  if (status === "success" && !conversations.length && !hasNextPage)
    return (
      <div className="p-5 flex items-center justify-center">
        <span className="text-center text-destructive">
          Không có thông báo nào.
        </span>
      </div>
    );

  return (
    <div className={cn(className)}>
      {/* Header chat */}
      <HeaderChat className={"sticky px-6 pt-[30px] pb-2 space-y-1"} />
      {/* Search input */}
      <SearchInput
        className={"flex max-h-full flex-col px-5"}
        inputSearch={inputSearch}
        setInputSearch={setInputSearch}
      />
      {/* Chat element  */}
      <ScrollArea className="max-h-full px-5 py-2">
        {status === "pending" && (
          <div className="space-y-2 max-w-full">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center space-x-4 w-full">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}
        {status === "success" && !conversations.length && !hasNextPage && (
          <span className="text-center text-destructive">
            Không có thông báo nào.
          </span>
        )}
        {status === "error" && (
          <div className="max-w-full max-h-full flex flex-col items-center justify-center space-y-5 opacity-50">
            <TriangleAlert className="size-20" />
            <span className="font-semibold">Lỗi</span>
          </div>
        )}
        <InfiniteScrollContainer
          onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
          className="max-h-full space-y-3"
        >
          {conversations.map((chat) => (
            <ChatElement
              key={chat._id}
              data={chat}
              className={
                "px-4 py-2 flex cursor-pointer items-center rounded-md bg-muted hover:bg-muted-foreground transition-all"
              }
            />
          ))}
          {isFetchingNextPage && (
            <LoaderCircle className="mx-auto size-5 animate-spin" />
          )}
        </InfiniteScrollContainer>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;

const HeaderChat = ({ className }) => {
  const [isShowCreateConversation, setIsShowCreateConversation] =
    useState(false);

  return (
    <div className={cn(className)}>
      {/* create conversation */}
      <DialogCreateConversation
        open={isShowCreateConversation}
        onOpenChange={setIsShowCreateConversation}
      />
      <div className="flex items-center flex-row justify-between">
        <div className="flex items-center space-x-1">
          <h1 className="text-xl 2xl:text-2xl font-bold cursor-default">
            Chats
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-50 hover:opacity-100 transition-all"
          onClick={() => setIsShowCreateConversation(true)}
        >
          <Plus className="size-5" />
        </Button>
      </div>
      <Divider />
    </div>
  );
};

const SearchInput = ({ className, inputSearch, setInputSearch }) => {
  return (
    <div className={cn(className)}>
      <form className="sticky mb-2">
        <Input
          placeholder="Tìm kiếm..."
          onChange={(e) => setInputSearch({ q: e.target.value.trim() || null })}
          className="w-full rounded-md bg-muted pr-10"
        />
        <Button
          variant="ghost"
          size="icon"
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          disabled={!inputSearch.q}
        >
          <Search className="size-5" />
        </Button>
      </form>
      <Divider />
    </div>
  );
};

const lastMessageToType = (type) => {
  switch (type) {
    case "Medias":
      return "Đã gửi hình ảnh hoặc video.";
    case "Audio":
      return "Đã gửi tập tin âm thanh.";
    case "Doc":
      return "Đã gửi tập tin tài liệu.";
    case "Giphy":
      return "Đã gửi tập tin GIF.";

    default:
      return "Đã gửi tin nhắn.";
  }
};

const ChatElement = ({ className, data }) => {
  const { currentData } = useCurrentStore();
  const { setConversation } = useConversationStore();
  const navigate = useNavigate();
  const userConversation = data.participants.find(
    (el) => el._id !== currentData._id
  );

  const handleOnclick = async () => {
    const success = await fetchMarkAsRead();
    if (success) {
      setConversation(data);
      socket.emit("get-room-members", data._id, (members) => {
        const isMemberRoom = members.includes(currentData.socketId);
        if (!isMemberRoom) socket.emit("join-room", data._id);
      });
      navigate(`/${path.MESSAGER}/${userConversation._id}`);
    }
  };

  return (
    <div className={cn("justify-between", className)} onClick={handleOnclick}>
      <div className="w-full flex items-center space-x-2">
        <UserAvatar
          avatarUrl={userConversation.avatarUrl}
          displayName={data.nameConversation}
          className={"border border-primary"}
          status={userConversation.status}
        />
        <div className="w-full">
          <span className="text-sm font-medium line-clamp-1">
            {data.nameConversation}
          </span>
          <small className="opacity-50 line-clamp-1">{`${
            data.lastMessage.senderId === currentData._id ? "Bạn:" : ""
          } ${lastMessageToType(data.lastMessage.type)}`}</small>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-sm opacity-50 whitespace-nowrap">
          {formatDate(data.updatedAt, "HH:mm")}
        </span>
        <span
          className={cn(
            "rounded-full bg-red-600 px-1 text-xs font-medium tabular-nums text-white",
            +data.unreadCount > 0 ? "block" : "hidden"
          )}
        >
          {+data.unreadCount > 50 ? "+50" : +data.unreadCount}
        </span>
      </div>
    </div>
  );
};
